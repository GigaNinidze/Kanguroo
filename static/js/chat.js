// Chat functionality for Kan-guroo Web App
class ChatManager {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.clearButton = document.getElementById('clearButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.audioPlayer = document.getElementById('audioPlayer');
        
        this.isProcessing = false;
        this.currentAudio = null;
        this.recognition = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.checkConnectionStatus();
        
        // Focus on input
        this.messageInput.focus();
    }
    
    setupEventListeners() {
        // Send message on Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Voice button
        this.voiceButton.addEventListener('click', () => {
            this.toggleVoiceInput();
        });
        
        // Clear button
        this.clearButton.addEventListener('click', () => {
            this.clearChat();
        });
        
        // Input change handler
        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
        });
        
        // Audio player events
        this.audioPlayer.addEventListener('ended', () => {
            this.onAudioEnded();
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            this.onAudioEnded();
        });
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.updateSendButton();
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.setVoiceButtonState(false);
            };
            
            this.recognition.onend = () => {
                this.setVoiceButtonState(false);
            };
        } else {
            this.voiceButton.style.display = 'none';
        }
    }
    
    async checkConnectionStatus() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            if (data.status === 'online') {
                this.setStatusIndicator('online', 'Connected');
            } else {
                this.setStatusIndicator('error', 'Disconnected');
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            this.setStatusIndicator('error', 'Connection Error');
        }
    }
    
    setStatusIndicator(status, text) {
        const dot = this.statusIndicator.querySelector('.status-dot');
        const textElement = this.statusIndicator.querySelector('.status-text');
        
        dot.className = `status-dot ${status}`;
        textElement.textContent = text;
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isProcessing;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and disable
        this.messageInput.value = '';
        this.updateSendButton();
        this.setProcessingState(true);
        
        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: 'web_user'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Add bot response
                this.addMessage(data.response_text, 'bot');
                
                // Play audio if available
                if (data.audio_file) {
                    await this.playAudio(data.audio_file);
                }
                
                // Handle viseme data for lip-sync
                console.log('Received response data:', data);
                if (data.viseme_data) {
                    console.log('Viseme data received:', data.viseme_data);
                    console.log('Viseme count:', data.viseme_data.visemes?.length || 0);
                    console.log('Duration:', data.viseme_data.duration);
                    
                    if (window.kanGurooApp) {
                        console.log('Starting lip sync with app');
                        window.kanGurooApp.startLipSync(data.viseme_data);
                    } else if (window.characterManager) {
                        console.log('Starting lip sync with character manager (fallback)');
                        window.characterManager.startLipSync(data.viseme_data);
                    } else {
                        console.warn('No lip sync manager available');
                    }
                } else {
                    console.log('No viseme data in response');
                }
                
                // Show relevant URLs if any
                if (data.relevant_urls && data.relevant_urls.length > 0) {
                    this.showRelevantUrls(data.relevant_urls);
                }
                
            } else {
                this.addMessage(data.error || 'Sorry, I encountered an error. Please try again.', 'bot');
            }
            
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('Sorry, I\'m having trouble connecting. Please try again.', 'bot');
        } finally {
            this.setProcessingState(false);
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">${sender === 'bot' ? '🤖' : '👤'}</div>
                <div class="message-text">${text}</div>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    async playAudio(audioFile) {
        try {
            this.audioPlayer.src = `/api/audio/${audioFile}`;
            await this.audioPlayer.play();
            
            // Set character to talking state
            if (window.characterManager) {
                window.characterManager.setAnimationStatus('talking');
            }
            
        } catch (error) {
            console.error('Audio playback error:', error);
        }
    }
    
    onAudioEnded() {
        // Set character back to idle
        if (window.characterManager) {
            window.characterManager.setAnimationStatus('idle');
        }
    }
    
    showRelevantUrls(urls) {
        const urlsDiv = document.createElement('div');
        urlsDiv.className = 'message bot-message';
        urlsDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">🔗</div>
                <div class="message-text">
                    <strong>Related Links:</strong><br>
                    ${urls.map(url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`).join('<br>')}
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(urlsDiv);
        this.scrollToBottom();
    }
    
    toggleVoiceInput() {
        if (!this.recognition) return;
        
        if (this.recognition.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.setVoiceButtonState(true);
        }
    }
    
    setVoiceButtonState(isListening) {
        this.voiceButton.classList.toggle('active', isListening);
        this.voiceButton.title = isListening ? 'Stop listening' : 'Start voice input';
    }
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-content">
                        <div class="message-avatar">🤖</div>
                        <div class="message-text">
                            Hello! I'm Kan-guroo, your AI assistant. I can help you learn about our educational programs and exchange opportunities. What would you like to know?
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    setProcessingState(isProcessing) {
        this.isProcessing = isProcessing;
        this.sendButton.disabled = isProcessing;
        
        if (isProcessing) {
            this.loadingOverlay.classList.add('show');
            if (window.characterManager) {
                window.characterManager.setAnimationStatus('thinking');
            }
        } else {
            this.loadingOverlay.classList.remove('show');
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Export for use in other modules
window.ChatManager = ChatManager;
