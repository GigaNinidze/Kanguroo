import asyncio
import aiohttp
import time
import os
from typing import Optional, Tuple
from config import ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID

class ElevenLabsService:
    def __init__(self):
        if not ELEVENLABS_API_KEY:
            raise ValueError("ELEVENLABS_API_KEY is required")
        
        self.api_key = ELEVENLABS_API_KEY
        self.voice_id = ELEVENLABS_VOICE_ID
        self.base_url = "https://api.elevenlabs.io/v1"
        
        # Performance optimizations
        self.session = None
        self.timeout = aiohttp.ClientTimeout(total=10, connect=5)
        self.connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
    
    async def _get_session(self):
        """Get or create persistent session for better performance"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(
                connector=self.connector,
                timeout=self.timeout,
                headers={
                    "Accept": "audio/mpeg",
                    "xi-api-key": self.api_key
                }
            )
        return self.session
    
    async def text_to_speech_with_visemes(self, text: str, output_path: str = "temp_audio.mp3") -> Tuple[Optional[str], Optional[dict]]:
        """Convert text to speech using ElevenLabs API with viseme data for lip-sync"""
        start_time = time.time()
        
        try:
            # Optimize text length for faster processing
            if len(text) > 200:
                # Find the last complete sentence within 200 chars
                truncated = text[:200]
                last_period = truncated.rfind('.')
                if last_period > 100:  # Only if we have a reasonable sentence
                    text = text[:last_period + 1]
                else:
                    text = text[:200] + "..."
                print(f"⚠️  Text truncated to {len(text)} chars for faster TTS")
            
            # Prepare the request with optimized settings
            url = f"{self.base_url}/text-to-speech/{self.voice_id}"
            
            data = {
                "text": text,
                "model_id": "eleven_turbo_v2_5",  # Faster model
                "voice_settings": {
                    "stability": 0.3,  # Lower for faster generation
                    "similarity_boost": 0.3,  # Lower for faster generation
                    "style": 0.0,  # No style for speed
                    "use_speaker_boost": False  # Disable for speed
                },
                "output_format": "mp3_44100_128",  # Standard format
                "optimize_streaming_latency": 3  # Maximum optimization
            }
            
            # Use persistent session for better performance
            session = await self._get_session()
            
            async with session.post(url, json=data) as response:
                if response.status == 200:
                    # Optimized file writing with larger chunks
                    with open(output_path, 'wb') as f:
                        async for chunk in response.content.iter_chunked(32768):  # Larger chunks
                            f.write(chunk)
                    
                    elapsed_time = (time.time() - start_time) * 1000
                    print(f"ElevenLabs TTS time: {elapsed_time:.2f}ms")
                    
                    # Generate viseme data for lip-sync animation
                    viseme_data = await self._generate_viseme_data(text)
                    
                    return output_path, viseme_data
                else:
                    error_text = await response.text()
                    print(f"ElevenLabs API error: {response.status} - {error_text}")
                    return None, None
                        
        except Exception as e:
            print(f"Error in ElevenLabs service: {e}")
            return None, None
    
    async def _generate_viseme_data(self, text: str) -> dict:
        """Generate viseme data for lip-sync animation"""
        try:
            # This is a simplified viseme generation
            # In a real implementation, you would use ElevenLabs' phoneme API
            # or a separate phoneme analysis service
            
            # Basic viseme mapping for common phonemes
            viseme_map = {
                'A': 'viseme_sil', 'B': 'viseme_PP', 'C': 'viseme_kk', 'D': 'viseme_DD',
                'E': 'viseme_aa', 'F': 'viseme_ff', 'G': 'viseme_kk', 'H': 'viseme_aa',
                'I': 'viseme_aa', 'J': 'viseme_DD', 'K': 'viseme_kk', 'L': 'viseme_nn',
                'M': 'viseme_PP', 'N': 'viseme_nn', 'O': 'viseme_aa', 'P': 'viseme_PP',
                'Q': 'viseme_kk', 'R': 'viseme_rr', 'S': 'viseme_ss', 'T': 'viseme_DD',
                'U': 'viseme_aa', 'V': 'viseme_ff', 'W': 'viseme_aa', 'X': 'viseme_kk',
                'Y': 'viseme_aa', 'Z': 'viseme_ss'
            }
            
            # Generate basic viseme sequence
            visemes = []
            current_time = 0.0
            duration_per_char = 0.1  # 100ms per character
            
            for char in text.upper():
                if char in viseme_map:
                    visemes.append({
                        'time': current_time,
                        'viseme': viseme_map[char]
                    })
                current_time += duration_per_char
            
            return {
                'visemes': visemes,
                'duration': current_time,
                'text': text
            }
            
        except Exception as e:
            print(f"Error generating viseme data: {e}")
            return None
    
    async def close_session(self):
        """Close the persistent session"""
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def get_voices(self) -> Optional[list]:
        """Get available voices from ElevenLabs"""
        try:
            url = f"{self.base_url}/voices"
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("voices", [])
                    else:
                        print(f"Error fetching voices: {response.status}")
                        return None
                        
        except Exception as e:
            print(f"Error fetching voices: {e}")
            return None
    
    def cleanup_audio_file(self, file_path: str):
        """Clean up temporary audio file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up audio file: {e}")
