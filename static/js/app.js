// Main application initialization and coordination
class KanGurooApp {
    constructor() {
        this.chatManager = null;
        this.characterManager = null;
        this.lipSyncManager = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Kan-guroo Web App...');
            
            // Initialize chat manager
            this.chatManager = new ChatManager();
            console.log('Chat manager initialized');
            
            // Initialize character manager
            this.characterManager = new CharacterManager();
            console.log('Character manager initialized');
            
            // Initialize lip-sync manager
            this.lipSyncManager = new LipSyncManager(this.characterManager);
            console.log('Lip-sync manager initialized');
            
            // Set up global references for cross-module communication
            window.characterManager = this.characterManager;
            window.lipSyncManager = this.lipSyncManager;
            
            // Set up event listeners for coordination
            this.setupEventListeners();
            
            // Expose test methods globally
            this.exposeTestMethods();
            
            this.isInitialized = true;
            console.log('Kan-guroo Web App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Kan-guroo Web App:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }
    
    setupEventListeners() {
        // Listen for audio events to coordinate character animation
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.addEventListener('play', () => {
                this.onAudioStart();
            });
            
            audioPlayer.addEventListener('ended', () => {
                this.onAudioEnd();
            });
            
            audioPlayer.addEventListener('pause', () => {
                this.onAudioEnd();
            });
        }
        
        // Listen for window events
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // Listen for visibility changes to pause/resume animations
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
    }
    
    onAudioStart() {
        console.log('Audio started - setting character to talking state');
        if (this.characterManager) {
            this.characterManager.setTalkingState(true);
        }
    }
    
    onAudioEnd() {
        console.log('Audio ended - setting character to idle state');
        if (this.characterManager) {
            this.characterManager.setTalkingState(false);
        }
        if (this.lipSyncManager) {
            this.lipSyncManager.stopLipSync();
        }
    }
    
    // Method to start lip sync with viseme data
    startLipSync(visemeData) {
        console.log('App.startLipSync called with:', visemeData);
        if (this.lipSyncManager && visemeData) {
            this.lipSyncManager.startLipSync(visemeData);
        } else {
            console.warn('Lip sync manager not available or no viseme data');
        }
    }
    
    // Test method for lip sync
    testLipSync() {
        console.log('App.testLipSync called');
        
        // Create test viseme data
        const testVisemeData = {
            visemes: [
                { time: 0.0, viseme: 'viseme_aa' },
                { time: 0.2, viseme: 'viseme_ee' },
                { time: 0.4, viseme: 'viseme_ii' },
                { time: 0.6, viseme: 'viseme_oo' },
                { time: 0.8, viseme: 'viseme_uu' },
                { time: 1.0, viseme: 'viseme_sil' }
            ],
            duration: 1.2,
            text: 'Test lip sync'
        };
        
        console.log('Test viseme data:', testVisemeData);
        
        // Start lip sync with test data
        this.startLipSync(testVisemeData);
    }
    
    onPageHidden() {
        console.log('Page hidden - pausing animations');
        if (this.characterManager && this.characterManager.threeJSCharacter) {
            this.characterManager.threeJSCharacter.stopAnimation();
        }
    }
    
    onPageVisible() {
        console.log('Page visible - resuming animations');
        if (this.characterManager && this.characterManager.threeJSCharacter) {
            this.characterManager.threeJSCharacter.playAnimation('idle', true);
        }
    }
    
    showError(message) {
        // Create error overlay
        const errorOverlay = document.createElement('div');
        errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        errorOverlay.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <div style="font-size: 18px; margin-bottom: 16px;">Application Error</div>
                <div style="font-size: 14px; margin-bottom: 24px; opacity: 0.8;">${message}</div>
                <button onclick="location.reload()" style="
                    background: #FA8148;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">Refresh Page</button>
            </div>
        `;
        
        document.body.appendChild(errorOverlay);
    }
    
    cleanup() {
        console.log('Cleaning up Kan-guroo Web App...');
        
        if (this.characterManager) {
            this.characterManager.destroy();
        }
        
        if (this.lipSyncManager) {
            this.lipSyncManager.stopLipSync();
        }
        
        // Clean up any audio
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = '';
        }
    }
    
    // Public API methods
    getStatus() {
        return {
            initialized: this.isInitialized,
            chatManager: !!this.chatManager,
            characterManager: !!this.characterManager,
            lipSyncManager: !!this.lipSyncManager
        };
    }
    
    // Debug methods
    logDebugInfo() {
        console.log('Kan-guroo App Debug Info:');
        console.log('- Initialized:', this.isInitialized);
        console.log('- Chat Manager:', this.chatManager);
        console.log('- Character Manager:', this.characterManager);
        console.log('- Lip-sync Manager:', this.lipSyncManager);
        
        if (this.characterManager && this.characterManager.threeJSCharacter) {
            console.log('- Three.js Scene:', this.characterManager.threeJSCharacter.scene);
            console.log('- Character Model:', this.characterManager.threeJSCharacter.character);
        }
    }
    
    // Expose test methods globally
    exposeTestMethods() {
        window.testLipSync = () => this.testLipSync();
        window.testApp = () => this.logDebugInfo();
        window.testMouthAnimation = () => {
            if (this.characterManager) {
                this.characterManager.testMouthAnimation();
            }
        };
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Kan-guroo Web App...');
    window.kanGurooApp = new KanGurooApp();
});

// Export for global access
window.KanGurooApp = KanGurooApp;
