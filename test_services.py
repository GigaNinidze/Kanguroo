#!/usr/bin/env python3
"""
Test script to demonstrate Gemini + ElevenLabs integration with viseme data generation
This script shows developers exactly how the AI services work together
"""

import asyncio
import time
import json
from gemini_service import GeminiService
from elevenlabs_service import ElevenLabsService
from config import GEMINI_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID

class ServiceTester:
    def __init__(self):
        print("🧪 Initializing Service Tester...")
        print("=" * 60)
        
        # Initialize services
        self.gemini_service = GeminiService()
        self.elevenlabs_service = ElevenLabsService()
        
        print(f"✅ Gemini Service initialized")
        print(f"✅ ElevenLabs Service initialized")
        print(f"🎤 Voice ID: {ELEVENLABS_VOICE_ID}")
        print("=" * 60)
    
    async def test_gemini_response(self, user_question: str):
        """Test Gemini service and show the response"""
        print(f"\n🤖 Testing Gemini Service")
        print(f"📝 User Question: '{user_question}'")
        print("-" * 40)
        
        start_time = time.time()
        
        try:
            # Generate response with Gemini
            response_text = await self.gemini_service.generate_response(user_question)
            gemini_time = (time.time() - start_time) * 1000
            
            print(f"✅ Gemini Response ({gemini_time:.2f}ms):")
            print(f"📄 Text: {response_text}")
            print(f"📊 Length: {len(response_text)} characters")
            print(f"⏱️  Processing time: {gemini_time:.2f}ms")
            
            return response_text
            
        except Exception as e:
            print(f"❌ Gemini Error: {e}")
            return None
    
    async def test_elevenlabs_tts(self, text: str):
        """Test ElevenLabs TTS and show viseme data"""
        print(f"\n🎤 Testing ElevenLabs TTS")
        print(f"📝 Input Text: '{text}'")
        print("-" * 40)
        
        start_time = time.time()
        
        try:
            # Generate audio and viseme data
            audio_path = f"test_audio_{int(time.time())}.mp3"
            audio_file, viseme_data = await self.elevenlabs_service.text_to_speech_with_visemes(text, audio_path)
            
            tts_time = (time.time() - start_time) * 1000
            
            if audio_file:
                print(f"✅ Audio Generated ({tts_time:.2f}ms):")
                print(f"🎵 Audio file: {audio_file}")
                print(f"⏱️  Processing time: {tts_time:.2f}ms")
                
                if viseme_data:
                    print(f"\n🎭 Viseme Data Generated:")
                    print(f"📊 Total visemes: {len(viseme_data.get('visemes', []))}")
                    print(f"⏱️  Duration: {viseme_data.get('duration', 0):.2f} seconds")
                    print(f"📝 Original text: {viseme_data.get('text', 'N/A')}")
                    
                    # Show detailed viseme breakdown
                    print(f"\n🔍 Viseme Breakdown:")
                    visemes = viseme_data.get('visemes', [])
                    for i, viseme in enumerate(visemes[:10]):  # Show first 10 visemes
                        print(f"  {i+1:2d}. Time: {viseme.get('time', 0):.2f}s - Viseme: {viseme.get('viseme', 'N/A')}")
                    
                    if len(visemes) > 10:
                        print(f"  ... and {len(visemes) - 10} more visemes")
                    
                    # Show viseme statistics
                    viseme_counts = {}
                    for viseme in visemes:
                        v_name = viseme.get('viseme', 'unknown')
                        viseme_counts[v_name] = viseme_counts.get(v_name, 0) + 1
                    
                    print(f"\n📈 Viseme Statistics:")
                    for viseme_name, count in sorted(viseme_counts.items()):
                        percentage = (count / len(visemes)) * 100
                        print(f"  {viseme_name}: {count} times ({percentage:.1f}%)")
                    
                    return audio_file, viseme_data
                else:
                    print("⚠️  No viseme data generated")
                    return audio_file, None
            else:
                print("❌ Audio generation failed")
                return None, None
                
        except Exception as e:
            print(f"❌ ElevenLabs Error: {e}")
            return None, None
    
    async def test_full_pipeline(self, user_question: str):
        """Test the complete pipeline: Gemini → ElevenLabs → Viseme Data"""
        print(f"\n🚀 Testing Complete Pipeline")
        print(f"📝 User Question: '{user_question}'")
        print("=" * 60)
        
        total_start = time.time()
        
        # Step 1: Gemini Response
        gemini_response = await self.test_gemini_response(user_question)
        if not gemini_response:
            print("❌ Pipeline failed at Gemini step")
            return
        
        # Step 2: ElevenLabs TTS + Viseme Data
        audio_file, viseme_data = await self.test_elevenlabs_tts(gemini_response)
        if not audio_file:
            print("❌ Pipeline failed at ElevenLabs step")
            return
        
        total_time = (time.time() - total_start) * 1000
        
        # Step 3: Show complete results
        print(f"\n🎯 Complete Pipeline Results")
        print("=" * 60)
        print(f"✅ Success: Full pipeline completed")
        print(f"⏱️  Total time: {total_time:.2f}ms")
        print(f"🎵 Audio file: {audio_file}")
        print(f"🎭 Viseme data: {'Generated' if viseme_data else 'Not generated'}")
        
        if viseme_data:
            print(f"\n📊 Final Viseme Summary:")
            print(f"  • Total visemes: {len(viseme_data.get('visemes', []))}")
            print(f"  • Duration: {viseme_data.get('duration', 0):.2f}s")
            print(f"  • Text length: {len(viseme_data.get('text', ''))} chars")
            
            # Show sample viseme data for developers
            print(f"\n🔧 Sample Viseme Data (for developers):")
            sample_visemes = viseme_data.get('visemes', [])[:5]
            for viseme in sample_visemes:
                print(f"  {{'time': {viseme.get('time', 0):.2f}, 'viseme': '{viseme.get('viseme', 'N/A')}'}}")
            
            if len(viseme_data.get('visemes', [])) > 5:
                print(f"  ... and {len(viseme_data.get('visemes', [])) - 5} more")
        
        return {
            'gemini_response': gemini_response,
            'audio_file': audio_file,
            'viseme_data': viseme_data,
            'total_time': total_time
        }
    
    def show_viseme_mapping(self):
        """Show the viseme mapping system for developers"""
        print(f"\n🎭 Viseme Mapping System")
        print("=" * 60)
        
        viseme_map = {
            'viseme_sil': 'Silence (closed mouth)',
            'viseme_aa': 'A sound (open mouth)',
            'viseme_ee': 'E sound (smile shape)',
            'viseme_ii': 'I sound (narrow smile)',
            'viseme_oo': 'O sound (rounded lips)',
            'viseme_uu': 'U sound (puckered lips)',
            'viseme_kk': 'K sound (closed mouth)',
            'viseme_PP': 'P sound (lips together)',
            'viseme_ff': 'F sound (lip touch)',
            'viseme_DD': 'D sound (tongue touch)',
            'viseme_ss': 'S sound (narrow opening)',
            'viseme_nn': 'N sound (slightly open)',
            'viseme_rr': 'R sound (moderate open)',
            'viseme_th': 'TH sound (tongue out)'
        }
        
        print("📋 Supported Visemes:")
        for viseme, description in viseme_map.items():
            print(f"  • {viseme}: {description}")
        
        print(f"\n💡 How it works:")
        print(f"  1. ElevenLabs analyzes text and generates phoneme timing")
        print(f"  2. Phonemes are mapped to viseme shapes")
        print(f"  3. Viseme data includes timing and shape information")
        print(f"  4. Frontend applies visemes to 3D character in real-time")
    
    def show_api_configuration(self):
        """Show API configuration for developers"""
        print(f"\n⚙️  API Configuration")
        print("=" * 60)
        
        print(f"🤖 Gemini Configuration:")
        print(f"  • API Key: {'✅ Set' if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here' else '❌ Not set'}")
        print(f"  • Model: Gemini 1.5 Flash")
        print(f"  • Context: Company data from faq_data.json")
        
        print(f"\n🎤 ElevenLabs Configuration:")
        print(f"  • API Key: {'✅ Set' if ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != 'your_elevenlabs_api_key_here' else '❌ Not set'}")
        print(f"  • Voice ID: {ELEVENLABS_VOICE_ID}")
        print(f"  • Model: eleven_turbo_v2_5")
        print(f"  • Features: Viseme data generation")
        
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_gemini_api_key_here':
            print(f"\n⚠️  Warning: Gemini API key not configured")
        if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY == 'your_elevenlabs_api_key_here':
            print(f"⚠️  Warning: ElevenLabs API key not configured")

async def main():
    """Main test function"""
    print("🧪 KangurooAvatar Service Tester")
    print("=" * 60)
    print("This script demonstrates how Gemini + ElevenLabs work together")
    print("to generate text, audio, and viseme data for 3D character animation")
    print("=" * 60)
    
    # Initialize tester
    tester = ServiceTester()
    
    # Show configuration
    tester.show_api_configuration()
    
    # Show viseme mapping
    tester.show_viseme_mapping()
    
    # Test questions for different scenarios
    test_questions = [
        "Hello! Can you tell me about your exchange programs?",
        "What language courses do you offer?",
        "Who are the founders of Kan-Guroo?",
        "Tell me about studying abroad in the USA"
    ]
    
    print(f"\n🚀 Running Test Pipeline")
    print("=" * 60)
    
    # Test each question
    for i, question in enumerate(test_questions, 1):
        print(f"\n📝 Test {i}/{len(test_questions)}")
        print(f"Question: '{question}'")
        print("-" * 40)
        
        try:
            result = await tester.test_full_pipeline(question)
            if result:
                print(f"✅ Test {i} completed successfully")
            else:
                print(f"❌ Test {i} failed")
        except Exception as e:
            print(f"❌ Test {i} error: {e}")
        
        print("\n" + "=" * 60)
    
    print(f"\n🎯 Testing Complete!")
    print("=" * 60)
    print("📁 Check the generated audio files in the project directory")
    print("🔧 Use the viseme data to understand how lip-sync works")
    print("💡 This data is used by the frontend to animate the 3D character")

if __name__ == "__main__":
    # Check if we're in the right directory
    import os
    if not os.path.exists('faq_data.json'):
        print("❌ Error: Please run this script from the KangurooAvatar project directory")
        print("   The script needs access to faq_data.json and other project files")
        exit(1)
    
    # Run the test
    asyncio.run(main())
