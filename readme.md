# KangurooAvatar - AI-Powered 3D Character Chat Application

A sophisticated web application that combines AI-powered chat with a 3D animated character for an immersive conversational experience. The system uses Google Gemini for text generation, ElevenLabs for voice synthesis, and Three.js for 3D character animation with real-time lip-sync.

## 🎯 Project Overview

**KangurooAvatar** is a complete web application that creates an interactive AI assistant with a 3D character avatar. Users can chat with the AI through text or voice, and the character responds with synchronized speech and lip movements. The system is designed for educational consultation, specifically for Kan-Guroo's international education programs.

## 🏗️ Architecture Overview

The application follows a modern web architecture with:
- **Backend**: Flask (Python) with async processing
- **Frontend**: Vanilla JavaScript with Three.js for 3D rendering
- **AI Services**: Google Gemini (text generation) + ElevenLabs (voice synthesis)
- **3D Engine**: Three.js with GLTF character models
- **Real-time Features**: WebSocket-like communication for live updates

## 📁 File Structure & Components

### Backend Files (Python)

#### `app.py` - Main Flask Application
**Purpose**: Core web server and API endpoints
**Key Functions**:
- `WebKanGurooBot.process_message()`: Main message processing pipeline
- `@app.route('/api/chat')`: Handles chat requests
- `@app.route('/api/audio/<filename>')`: Serves generated audio files
- `@app.route('/Dona.glb')`: Serves 3D character model

**Important Features**:
- Async message processing with performance monitoring
- Integration of Gemini + ElevenLabs + viseme data generation
- URL relevance detection for educational programs
- Error handling and fallback mechanisms

#### `config.py` - Configuration Management
**Purpose**: Centralized configuration for API keys and settings
**Key Variables**:
- `GEMINI_API_KEY`: Google Gemini API authentication
- `ELEVENLABS_API_KEY`: ElevenLabs voice synthesis API
- `ELEVENLABS_VOICE_ID`: Specific voice model ID
- Performance settings (timeouts, response limits)

#### `gemini_service.py` - AI Text Generation
**Purpose**: Handles all text generation using Google Gemini
**Key Functions**:
- `GeminiService.__init__()`: Loads FAQ data and creates custom prompts
- `_create_custom_prompt()`: Builds context-aware prompts with company data
- `generate_response()`: Processes user questions with company context

**AI Model Used**: Google Gemini 1.5 Flash
**Features**:
- Context-aware responses using `faq_data.json`
- Company information integration (team, programs, contact info)
- Response optimization for voice generation (under 80 words)
- Performance monitoring and error handling

#### `elevenlabs_service.py` - Voice Synthesis & Lip-Sync
**Purpose**: Converts text to speech and generates viseme data for lip-sync
**Key Functions**:
- `text_to_speech_with_visemes()`: Main TTS function with viseme generation
- `_generate_viseme_data()`: Creates mouth shape data for animation
- `_get_session()`: Manages persistent HTTP connections for performance

**AI Service Used**: ElevenLabs API
**Features**:
- Optimized for speed (eleven_turbo_v2_5 model)
- Real-time viseme data generation for lip-sync
- Audio file management and cleanup
- Performance optimizations (connection pooling, chunked downloads)

#### `performance_monitor.py` - System Monitoring
**Purpose**: Tracks application performance and user metrics
**Key Functions**:
- `start_request()`: Begins tracking a new request
- `record_metrics()`: Records completion metrics
- `get_performance_stats()`: Returns comprehensive statistics

**Metrics Tracked**:
- Response times (Gemini, TTS, total)
- Success rates and error tracking
- User-specific statistics
- Performance trends and optimization insights

### Frontend Files (JavaScript)

#### `app.js` - Main Application Controller
**Purpose**: Coordinates all frontend components and manages application lifecycle
**Key Classes**:
- `KanGurooApp`: Main application controller
- Event coordination between chat, character, and lip-sync systems
- Error handling and user feedback

**Important Functions**:
- `init()`: Initializes all managers and sets up event listeners
- `startLipSync()`: Coordinates lip-sync animation with audio playback
- `onAudioStart()/onAudioEnd()`: Manages character state during speech

#### `chat.js` - Chat Interface Management
**Purpose**: Handles all chat functionality and user interactions
**Key Classes**:
- `ChatManager`: Manages chat UI, message handling, and API communication

**Key Functions**:
- `sendMessage()`: Processes user messages and handles API calls
- `playAudio()`: Manages audio playback and character coordination
- `setupVoiceRecognition()`: Enables voice input using Web Speech API
- `showRelevantUrls()`: Displays related educational program links

**Features**:
- Real-time message display with timestamps
- Voice input support (Web Speech API)
- Audio playback coordination with character animation
- URL relevance display for educational programs

#### `character.js` - 3D Character Management
**Purpose**: Controls 3D character rendering, animations, and lip-sync
**Key Classes**:
- `CharacterManager`: Manages character state and animations
- `ThreeJSCharacter`: Handles Three.js scene setup and rendering

**Key Functions**:
- `playAnimation()`: Controls character animation playback
- `startLipSync()`: Initiates lip-sync animation with viseme data
- `applyViseme()`: Applies mouth shapes based on phoneme data
- `setTalkingState()`: Manages character state (idle, talking, thinking)

**Animation System**:
- Multiple animation methods (blend shapes, bone animation, scaling)
- Real-time viseme application for lip-sync
- State management (idle, talking, thinking, error)
- Camera controls and user interaction

#### `lipsync.js` - Lip-Sync Animation System
**Purpose**: Advanced lip-sync animation with viseme timing and intensity
**Key Classes**:
- `LipSyncManager`: Manages lip-sync animation timing and application

**Key Functions**:
- `startLipSync()`: Initiates lip-sync with viseme data
- `applyViseme()`: Applies specific mouth shapes
- `animateCharacterMouth()`: Coordinates mouth animation methods

**Lip-Sync Features**:
- Real-time viseme timing based on audio
- Multiple animation methods (blend shapes, bone animation, morph targets)
- Viseme intensity mapping for realistic mouth shapes
- Smooth transitions between phonemes

#### `threejs-setup.js` - 3D Rendering Engine
**Purpose**: Three.js scene setup, lighting, and 3D model loading
**Key Classes**:
- `ThreeJSCharacter`: Core Three.js integration

**Key Functions**:
- `setupScene()`: Creates Three.js scene with proper lighting
- `loadCharacter()`: Loads GLTF character model with animations
- `setupLighting()`: Professional lighting setup for character rendering
- `animate()`: Main render loop with animation updates

**3D Features**:
- Professional lighting setup (ambient, directional, fill, rim)
- Shadow mapping and realistic rendering
- Orbit controls for user interaction
- Animation mixer for character animations
- Responsive rendering and performance optimization

### Data Files

#### `faq_data.json` - Company Knowledge Base
**Purpose**: Contains all company information, programs, and team data for AI context
**Structure**:
- Company information (name, mission, vision, values)
- Educational programs (exchange, summer schools, university programs, language courses)
- Team information (founders, roles, contact details)
- Program URLs and descriptions

**AI Integration**: This data is loaded into Gemini prompts to provide context-aware responses about Kan-Guroo's educational programs.

#### `Dona.glb` - 3D Character Model
**Purpose**: ReadyPlayerMe 3D character model in GLTF format
**Features**:
- Rigged character with animation support
- Blend shapes for facial expressions
- Optimized for web rendering
- Compatible with Three.js GLTFLoader

### Styling & UI

#### `style.css` - Design System Implementation
**Purpose**: Implements the design system with semantic colors, spacing, and animations
**Design Principles**:
- **Space**: Ample, purposeful spacing with 8pt grid system
- **Borders**: Minimal, using shadows and contrast instead
- **Colors**: Semantic palette (Crayola Orange, Rose Red, Mint, Vanilla)
- **Motion**: Physics-based animations with spring transitions
- **Consistency**: Uniform component styling and interactions

## 🤖 AI Services Integration

### Text Generation - Google Gemini
- **Model**: Gemini 1.5 Flash (optimized for speed)
- **Context**: Company data from `faq_data.json`
- **Prompt Engineering**: Custom prompts with educational program context
- **Response Optimization**: Limited to 80 words for faster voice generation
- **Performance**: Target <2000ms response time

### Voice Synthesis - ElevenLabs
- **Model**: eleven_turbo_v2_5 (optimized for speed)
- **Features**: High-quality voice synthesis with viseme data
- **Optimization**: Connection pooling, chunked downloads, streaming latency optimization
- **Audio Format**: MP3 44.1kHz 128kbps
- **Performance**: Target <1500ms generation time

## 🎭 3D Character Animation System

### Character Loading & Setup
1. **Model Loading**: GLTFLoader loads `Dona.glb` character model
2. **Scene Setup**: Professional lighting with shadows and realistic rendering
3. **Animation System**: AnimationMixer handles character animations
4. **User Controls**: OrbitControls for camera interaction

### Animation States
- **Idle**: Default resting animation
- **Talking**: Active speech animation with lip-sync
- **Thinking**: Processing state animation
- **Error**: Error state display

### Lip-Sync Implementation
1. **Viseme Generation**: ElevenLabs provides phoneme timing data
2. **Viseme Mapping**: Maps phonemes to mouth shapes (viseme_aa, viseme_ee, etc.)
3. **Animation Application**: Multiple methods for mouth animation:
   - **Blend Shapes**: Morph targets for facial expressions
   - **Bone Animation**: Jaw and mouth bone manipulation
   - **Scaling**: Geometric scaling for mouth area
4. **Real-time Sync**: RequestAnimationFrame loop for smooth animation

### Viseme System
**Supported Visemes**:
- `viseme_sil`: Silence (closed mouth)
- `viseme_aa`: A sound (open mouth)
- `viseme_ee`: E sound (smile shape)
- `viseme_ii`: I sound (narrow smile)
- `viseme_oo`: O sound (rounded lips)
- `viseme_uu`: U sound (puckered lips)
- `viseme_kk`: K sound (closed mouth)
- `viseme_PP`: P sound (lips together)
- `viseme_ff`: F sound (lip touch)
- `viseme_DD`: D sound (tongue touch)
- `viseme_ss`: S sound (narrow opening)

## 🔄 Message Processing Pipeline

### 1. User Input
- Text input via chat interface
- Voice input via Web Speech API
- Input validation and sanitization

### 2. Backend Processing
```
User Message → Gemini Service → ElevenLabs Service → Response
     ↓              ↓                ↓
  Validation    Text Generation   Voice + Visemes
```

### 3. AI Response Generation
1. **Gemini Processing**: 
   - Load company context from `faq_data.json`
   - Generate context-aware response
   - Optimize for voice generation (under 80 words)
   - Performance monitoring

2. **ElevenLabs Processing**:
   - Convert text to speech
   - Generate viseme data for lip-sync
   - Optimize audio settings for speed
   - Return audio file and viseme data

### 4. Frontend Coordination
1. **Audio Playback**: HTML5 audio element with event listeners
2. **Character Animation**: Lip-sync coordination with audio timing
3. **UI Updates**: Message display, status indicators, loading states

## 🚀 Performance Optimizations

### Backend Optimizations
- **Async Processing**: Non-blocking AI service calls
- **Connection Pooling**: Persistent HTTP sessions for ElevenLabs
- **Response Caching**: Temporary audio file management
- **Performance Monitoring**: Real-time metrics and optimization

### Frontend Optimizations
- **RequestAnimationFrame**: Smooth 60fps animation loop
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup of resources
- **Lazy Loading**: On-demand character model loading

### AI Service Optimizations
- **Model Selection**: Fast models (Gemini Flash, ElevenLabs Turbo)
- **Text Truncation**: Limit response length for faster TTS
- **Streaming**: Optimized audio generation settings
- **Error Handling**: Graceful fallbacks for service failures

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js (for development)
- API Keys: Google Gemini, ElevenLabs

### Environment Setup
1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   cp env_example.txt .env
   # Edit .env with your API keys
   ```

3. **Run Application**:
   ```bash
   python app.py
   ```

4. **Access Application**:
   - Open `http://localhost:5001` in browser
   - Chat interface on left, 3D character on right

### API Keys Required
- **GEMINI_API_KEY**: Google AI Studio API key
- **ELEVENLABS_API_KEY**: ElevenLabs API key
- **ELEVENLABS_VOICE_ID**: Specific voice model ID

## 🎯 Key Features

### Interactive Chat
- Real-time text and voice input
- Context-aware AI responses
- Educational program recommendations
- URL relevance detection

### 3D Character Animation
- Realistic 3D character rendering
- Real-time lip-sync with speech
- Multiple animation states
- User-controlled camera

### AI Integration
- Google Gemini for intelligent responses
- ElevenLabs for natural voice synthesis
- Company knowledge base integration
- Performance monitoring

### User Experience
- Responsive design for all devices
- Accessibility features
- Error handling and recovery
- Professional design system

## 🔧 Technical Specifications

### Backend
- **Framework**: Flask with async support
- **AI Services**: Google Gemini 1.5 Flash, ElevenLabs API
- **Performance**: <4000ms total response time
- **Monitoring**: Real-time performance tracking

### Frontend
- **3D Engine**: Three.js r128
- **Character Format**: GLTF/GLB (ReadyPlayerMe)
- **Audio**: HTML5 Audio API
- **Voice Input**: Web Speech API

### Character Animation
- **Format**: GLTF with blend shapes
- **Rigging**: Bone-based animation system
- **Lip-Sync**: Real-time viseme application
- **Performance**: 60fps animation loop

## 📊 Performance Metrics

### Target Performance
- **Total Response Time**: <4000ms
- **Gemini Processing**: <2000ms
- **TTS Generation**: <1500ms
- **Character Animation**: 60fps

### Monitoring
- Real-time performance tracking
- User-specific statistics
- Error rate monitoring
- Optimization insights

## 🎨 Design System

The application follows a comprehensive design system with:

### Color Palette
- **Primary Action**: Crayola Orange (#FA8148)
- **Destructive Action**: Rose Red (#CA1551)
- **Confirmation**: Mint (#03CEA4)
- **Background**: Vanilla (#FFF5B2)

### Spacing System
- 8pt grid system for consistent spacing
- Generous padding for touch accuracy
- Purposeful white space for readability

### Typography
- System fonts for optimal performance
- Consistent sizing scale
- Accessible contrast ratios

### Motion & Depth
- Physics-based animations
- Spring transitions
- Subtle shadows and layering
- Functional animations only

## 🔮 Future Enhancements

### Planned Features
- Multiple character models
- Advanced emotion recognition
- Multi-language support
- Enhanced lip-sync accuracy
- Real-time collaboration

### Technical Improvements
- WebRTC for real-time communication
- Advanced AI model integration
- Performance optimizations
- Mobile app development

---

This comprehensive system creates an immersive AI-powered educational consultation experience, combining cutting-edge AI services with sophisticated 3D character animation for a truly engaging user experience.
