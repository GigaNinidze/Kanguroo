# Kan-guroo Web App Setup Guide

## Overview
This is a complete web application featuring an AI chatbot with a 3D animated character. The app integrates Google Gemini AI, ElevenLabs text-to-speech, and Three.js for 3D character animation with lip-sync.

## Features
- 🤖 AI Chat Interface (Google Gemini)
- 🎤 Text-to-Speech (ElevenLabs)
- 🎭 3D Character Animation (Three.js)
- 👄 Lip-sync Animation
- 🎨 Modern UI Design
- 📱 Responsive Layout

## Prerequisites
- Python 3.8+
- Node.js (for development)
- API Keys:
  - Google Gemini API Key
  - ElevenLabs API Key
  - ElevenLabs Voice ID

## Installation

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Copy `env_example.txt` to `.env` and add your API keys:
```bash
cp env_example.txt .env
```

Edit `.env` with your actual API keys:
```
GEMINI_API_KEY=your_actual_gemini_api_key
ELEVENLABS_API_KEY=your_actual_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_actual_voice_id
```

### 3. Verify Files
Make sure you have:
- `Dona.glb` - 3D character model
- `faq_data.json` - Company data for AI prompts
- All Python files in the root directory
- `templates/` and `static/` directories with HTML/CSS/JS files

## Running the Application

### 1. Start the Flask Server
```bash
python app.py
```

### 2. Open in Browser
Navigate to: `http://localhost:5001`

## Project Structure
```
KangurooAvatar/
├── app.py                          # Main Flask application
├── config.py                      # Configuration settings
├── gemini_service.py              # Google Gemini AI integration
├── elevenlabs_service.py          # ElevenLabs TTS integration
├── performance_monitor.py         # Performance tracking
├── requirements.txt               # Python dependencies
├── faq_data.json                  # Company data for AI
├── Dona.glb                       # 3D character model
├── templates/
│   └── index.html                 # Main HTML template
└── static/
    ├── css/
    │   └── style.css              # Main stylesheet
    └── js/
        ├── app.js                 # Main application logic
        ├── chat.js                # Chat functionality
        ├── character.js           # 3D character management
        ├── lipsync.js             # Lip-sync animation
        └── threejs-setup.js       # Three.js setup
```

## API Endpoints
- `GET /` - Main chat interface
- `POST /api/chat` - Send chat message
- `GET /api/audio/<filename>` - Serve audio files
- `GET /api/status` - Application status
- `GET /api/health` - Health check

## Configuration

### API Keys Setup
1. **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **ElevenLabs**: Get your API key and voice ID from [ElevenLabs](https://elevenlabs.io/)

### Character Model
- The app expects `Dona.glb` in the root directory
- This should be a ReadyPlayerMe character model
- Supports standard GLB format with animations

### Customization
- Edit `faq_data.json` to update company information
- Modify `config.py` for application settings
- Update CSS in `static/css/style.css` for styling

## Troubleshooting

### Common Issues
1. **Character not loading**: Check if `Dona.glb` exists and is accessible
2. **API errors**: Verify your API keys in `.env` file
3. **Audio not playing**: Check browser audio permissions
4. **CORS errors**: Ensure Flask-CORS is properly installed

### Debug Mode
Set `DEBUG = True` in `config.py` for detailed error messages.

### Performance
- The app targets <4000ms response time
- Character animations are optimized for 60fps
- Audio files are cached for better performance

## Development

### Adding New Features
1. Backend: Add new routes in `app.py`
2. Frontend: Add new JavaScript modules
3. Styling: Update CSS with design system colors

### Design System
The app follows a specific design system:
- **Colors**: Primary (#FA8148), Destructive (#CA1551), Confirmation (#03CEA4)
- **Spacing**: 8pt modular scale
- **Typography**: System fonts with clear hierarchy
- **Animations**: Physics-based, purposeful motion

## Support
For issues or questions, check the console logs and ensure all dependencies are properly installed.
