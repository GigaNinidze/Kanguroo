"""
Configuration file for Kan-guroo Web Bot
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys - Set these as environment variables or update directly
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your_gemini_api_key_here')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', 'your_elevenlabs_api_key_here')
ELEVENLABS_VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID', 'your_voice_id_here')

# Application settings
DEBUG = True
HOST = '0.0.0.0'
PORT = 5001

# File paths
FAQ_DATA_PATH = 'faq_data.json'
CHARACTER_MODEL_PATH = 'Dona.glb'
TEMP_AUDIO_DIR = 'temp_audio'

# Performance settings
MAX_RESPONSE_TIME = 4000  # milliseconds
TTS_TIMEOUT = 10  # seconds
GEMINI_TIMEOUT = 15  # seconds

# Character animation settings
ANIMATION_SPEED = 1.0
LIPSYNC_SENSITIVITY = 0.5