#!/usr/bin/env python3
"""
Complete Web version of Kan-guroo bot with text, audio, 3D character, and URL responses
"""

import asyncio
import time
import os
import json
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from gemini_service import GeminiService
from elevenlabs_service import ElevenLabsService
from performance_monitor import performance_monitor
from config import GEMINI_API_KEY, ELEVENLABS_API_KEY

app = Flask(__name__)
CORS(app)

class WebKanGurooBot:
    def __init__(self):
        self.gemini_service = GeminiService()
        self.elevenlabs_service = None
        self.performance_monitor = performance_monitor
    
    def _get_elevenlabs_service(self):
        """Get ElevenLabs service, creating it if needed"""
        if self.elevenlabs_service is None:
            self.elevenlabs_service = ElevenLabsService()
        return self.elevenlabs_service
    
    def _find_relevant_urls(self, user_message: str) -> list:
        """Find relevant URLs based on user message"""
        try:
            with open('faq_data.json', 'r', encoding='utf-8') as f:
                faq_data = json.load(f)
            
            company_info = faq_data.get("company", {})
            programs = company_info.get("programs", {})
            
            relevant_urls = []
            user_message_lower = user_message.lower()
            
            # Check for specific program mentions
            for program_type, program_list in programs.items():
                for program in program_list:
                    program_name_lower = program['name'].lower()
                    
                    # Check if user is asking about this specific program
                    if any(keyword in user_message_lower for keyword in program_name_lower.split()):
                        if 'url' in program:
                            relevant_urls.append(program['url'])
                    
                    # Check for language course mentions
                    if 'english' in user_message_lower and 'english' in program_name_lower:
                        if 'url' in program:
                            relevant_urls.append(program['url'])
                    elif 'german' in user_message_lower and 'german' in program_name_lower:
                        if 'url' in program:
                            relevant_urls.append(program['url'])
                    
                    # Check for exchange program mentions
                    if any(keyword in user_message_lower for keyword in ['exchange', 'high school', 'usa', 'europe']):
                        if 'url' in program:
                            relevant_urls.append(program['url'])
            
            # Remove duplicates
            relevant_urls = list(set(relevant_urls))
            return relevant_urls
            
        except Exception as e:
            print(f"Error finding relevant URLs: {e}")
            return []
    
    async def process_message(self, user_message: str, user_id: str = "web_user"):
        """Process user message and return text, audio, and URLs"""
        start_time = time.time()
        request_id = self.performance_monitor.start_request(user_id)
        
        try:
            # Step 1: Generate response with Gemini
            print("🤖 Generating response with Gemini...")
            gemini_start = time.time()
            response_text = await self.gemini_service.generate_response(user_message)
            gemini_time = (time.time() - gemini_start) * 1000
            print(f"✅ Gemini completed in {gemini_time:.2f}ms")
            
            # Step 2: Find relevant URLs
            relevant_urls = self._find_relevant_urls(user_message)
            print(f"🔗 Found {len(relevant_urls)} relevant URLs")
            
            # Step 3: Generate audio with ElevenLabs
            audio_file = None
            tts_time = 0
            tts_success = False
            viseme_data = None
            
            try:
                print("🎤 Converting to speech...")
                tts_start = time.time()
                audio_path = f"temp_audio_{user_id}_{int(time.time())}.mp3"
                elevenlabs_service = self._get_elevenlabs_service()
                audio_file, viseme_data = await elevenlabs_service.text_to_speech_with_visemes(response_text, audio_path)
                tts_time = (time.time() - tts_start) * 1000
                
                if audio_file and os.path.exists(audio_file):
                    tts_success = True
                    print(f"✅ TTS completed in {tts_time:.2f}ms - Audio file: {audio_file}")
                else:
                    print(f"⚠️  TTS failed, continuing with text only")
                    
            except Exception as tts_error:
                print(f"⚠️  TTS error: {tts_error}, continuing with text only")
                tts_time = 0
            
            # Step 4: Prepare response
            success = bool(response_text and response_text.strip())
            
            # Record performance metrics
            self.performance_monitor.record_metrics(
                request_id, user_id, gemini_time, tts_time, success, len(response_text)
            )
            
            # Performance logging
            total_time = (time.time() - start_time) * 1000
            print(f"🚀 Total processing time: {total_time:.2f}ms")
            print(f"📊 Breakdown - Gemini: {gemini_time:.2f}ms, TTS: {tts_time:.2f}ms")
            
            return {
                "success": success,
                "response_text": response_text,
                "audio_file": audio_file if tts_success else None,
                "viseme_data": viseme_data if tts_success else None,
                "relevant_urls": relevant_urls,
                "performance": {
                    "total_time": total_time,
                    "gemini_time": gemini_time,
                    "tts_time": tts_time
                }
            }
            
        except Exception as e:
            print(f"Error in message processing pipeline: {e}")
            self.performance_monitor.record_metrics(
                request_id, user_id, 0, 0, False, 0, str(e)
            )
            return {
                "success": False,
                "error": str(e),
                "response_text": "I'm sorry, I encountered an error processing your request. Please try again.",
                "audio_file": None,
                "viseme_data": None,
                "relevant_urls": []
            }

# Initialize bot
web_bot = WebKanGurooBot()

@app.route('/')
def index():
    """Main chat interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        user_id = data.get('user_id', 'web_user')
        
        if not user_message.strip():
            return jsonify({
                "success": False,
                "error": "Empty message"
            })
        
        print(f"📝 Processing message: {user_message}")
        
        # Process message asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(web_bot.process_message(user_message, user_id))
        loop.close()
        
        print(f"✅ Response ready: {result['success']}")
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        })

@app.route('/api/audio/<filename>')
def get_audio(filename):
    """Serve audio files"""
    try:
        print(f"🎵 Serving audio file: {filename}")
        return send_file(filename, mimetype='audio/mpeg')
    except Exception as e:
        print(f"Error serving audio: {e}")
        return jsonify({"error": "Audio file not found"}), 404

@app.route('/Dona.glb')
def get_character():
    """Serve the 3D character model"""
    try:
        print(f"🎭 Serving character model: Dona.glb")
        return send_file('Dona.glb', mimetype='model/gltf-binary')
    except Exception as e:
        print(f"Error serving character model: {e}")
        return jsonify({"error": "Character model not found"}), 404

@app.route('/static/models/<filename>')
def get_model(filename):
    """Serve 3D model files"""
    try:
        return send_from_directory('.', filename, mimetype='model/gltf-binary')
    except Exception as e:
        print(f"Error serving model file: {e}")
        return jsonify({"error": "Model file not found"}), 404

@app.route('/api/status')
def status():
    """Get bot status and performance metrics"""
    try:
        stats = web_bot.performance_monitor.get_performance_stats()
        return jsonify({
            "status": "online",
            "performance": stats,
            "bot_name": "Kan-guroo",
            "version": "1.0.0"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": time.time()
    })

if __name__ == '__main__':
    print("🌐 Starting Kan-guroo Complete Web Bot...")
    print("=" * 60)
    print("🤖 Bot: Kan-guroo Web Assistant")
    print("🧠 AI: Gemini 1.5 Flash")
    print("🎤 TTS: ElevenLabs")
    print("🎭 3D Character: Dona (ReadyPlayerMe)")
    print("⚡ Target response time: <4000ms")
    print("🌐 Web interface: http://localhost:5001")
    print("📝 Features: Text + Audio + 3D Character + URLs")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5001)
