// Character animation and control management
class CharacterManager {
    constructor() {
        this.threeJSCharacter = null;
        this.isInitialized = false;
        this.currentAnimation = 'idle';
        this.lipSyncActive = false;
        this.visemeData = null;
        this.animationStartTime = 0;
        
        this.init();
    }
    
    init() {
        // Initialize Three.js character
        try {
            this.threeJSCharacter = new ThreeJSCharacter('characterCanvas');
            this.threeJSCharacter.onCharacterLoaded = () => {
                this.onCharacterLoaded();
            };
            this.threeJSCharacter.onCharacterLoadError = (error) => {
                this.onCharacterLoadError(error);
            };
            
            this.setupEventListeners();
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Failed to initialize character:', error);
            this.onCharacterLoadError(error);
        }
    }
    
    setupEventListeners() {
        // Reset camera button
        const resetCameraBtn = document.getElementById('resetCamera');
        if (resetCameraBtn) {
            resetCameraBtn.addEventListener('click', () => {
                this.resetCamera();
            });
        }
        
        // Toggle animation button
        const toggleAnimationBtn = document.getElementById('toggleAnimation');
        if (toggleAnimationBtn) {
            toggleAnimationBtn.addEventListener('click', () => {
                this.toggleAnimation();
            });
        }
        
        // Test lip sync button
        const testLipSyncBtn = document.getElementById('testLipSync');
        if (testLipSyncBtn) {
            testLipSyncBtn.addEventListener('click', () => {
                // Use app's test method if available, otherwise use character manager's
                if (window.kanGurooApp && window.kanGurooApp.testLipSync) {
                    window.kanGurooApp.testLipSync();
                } else {
                    this.testLipSync();
                }
            });
        }
        
        // Test mouth animation button
        const testMouthAnimationBtn = document.getElementById('testMouthAnimation');
        if (testMouthAnimationBtn) {
            testMouthAnimationBtn.addEventListener('click', () => {
                this.testMouthAnimation();
            });
        }
    }
    
    onCharacterLoaded() {
        console.log('Character loaded successfully');
        this.setAnimationStatus('idle');
        this.playAnimation('idle', true);
    }
    
    onCharacterLoadError(error) {
        console.error('Character load error:', error);
        this.setAnimationStatus('error');
        
        // Show error message in character area
        const canvas = document.getElementById('characterCanvas');
        if (canvas) {
            canvas.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center; padding: 20px;">
                    <div>
                        <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                        <div style="font-size: 16px; margin-bottom: 8px;">Character Loading Error</div>
                        <div style="font-size: 14px; color: #999;">Please refresh the page to try again</div>
                    </div>
                </div>
            `;
        }
    }
    
    playAnimation(animationName, loop = true) {
        if (!this.threeJSCharacter) return;
        
        this.currentAnimation = animationName;
        this.threeJSCharacter.playAnimation(animationName, loop);
        
        console.log(`Playing animation: ${animationName}`);
    }
    
    stopAnimation() {
        if (!this.threeJSCharacter) return;
        
        this.threeJSCharacter.stopAnimation();
        this.currentAnimation = 'idle';
    }
    
    setAnimationStatus(status) {
        if (!this.threeJSCharacter) return;
        
        this.threeJSCharacter.setAnimationStatus(status);
    }
    
    startLipSync(visemeData) {
        console.log('CharacterManager.startLipSync called with:', visemeData);
        
        if (!this.threeJSCharacter) {
            console.warn('ThreeJS character not available for lip sync');
            return;
        }
        
        if (!visemeData) {
            console.warn('No viseme data provided for lip sync');
            return;
        }
        
        this.visemeData = visemeData;
        this.lipSyncActive = true;
        this.animationStartTime = Date.now();
        
        console.log('Starting lip-sync animation with', visemeData.visemes?.length || 0, 'visemes');
        console.log('Total duration:', visemeData.duration);
        this.setAnimationStatus('talking');
        
        // Start the lip-sync animation loop
        this.animateLipSync();
    }
    
    stopLipSync() {
        this.lipSyncActive = false;
        this.visemeData = null;
        this.setAnimationStatus('idle');
        this.playAnimation('idle', true);
    }
    
    animateLipSync() {
        if (!this.lipSyncActive || !this.visemeData) {
            console.log('Lip sync stopped - active:', this.lipSyncActive, 'data:', !!this.visemeData);
            this.stopLipSync();
            return;
        }
        
        const currentTime = (Date.now() - this.animationStartTime) / 1000; // Convert to seconds
        const visemes = this.visemeData.visemes || [];
        
        // Find current viseme based on time
        let currentViseme = null;
        for (let i = 0; i < visemes.length; i++) {
            if (visemes[i].time <= currentTime) {
                currentViseme = visemes[i];
            } else {
                break;
            }
        }
        
        // Apply viseme to character (simplified implementation)
        if (currentViseme && this.threeJSCharacter.character) {
            console.log('Applying viseme:', currentViseme.viseme, 'at time:', currentTime);
            this.applyViseme(currentViseme.viseme);
        }
        
        // Check if animation should end
        if (currentTime >= this.visemeData.duration) {
            console.log('Lip sync animation completed');
            this.stopLipSync();
        } else {
            requestAnimationFrame(() => this.animateLipSync());
        }
    }
    
    applyViseme(visemeName) {
        console.log('CharacterManager.applyViseme called with:', visemeName);
        
        // This is a simplified viseme application
        // In a real implementation, you would map visemes to specific mouth shapes
        // and animate the character's mouth accordingly
        
        if (!this.threeJSCharacter.character) {
            console.warn('ThreeJS character not available for viseme application');
            return;
        }
        
        // Example viseme mapping (this would need to be customized for your character)
        const visemeMap = {
            'viseme_sil': 0.0,    // Silence
            'viseme_aa': 0.3,     // A sound
            'viseme_kk': 0.1,     // K sound
            'viseme_nn': 0.2,     // N sound
            'viseme_DD': 0.4,     // D sound
            'viseme_ff': 0.5,     // F sound
            'viseme_PP': 0.6,     // P sound
            'viseme_rr': 0.3,     // R sound
            'viseme_ss': 0.4,     // S sound
        };
        
        const intensity = visemeMap[visemeName] || 0.0;
        console.log('Viseme intensity:', intensity);
        
        // Apply the viseme to the character
        // This would typically involve animating mouth blend shapes or morph targets
        this.animateMouthShape(intensity);
    }
    
    animateMouthShape(intensity) {
        console.log('CharacterManager.animateMouthShape called with intensity:', intensity);
        
        if (!this.threeJSCharacter.character) {
            console.warn('ThreeJS character not available for mouth animation');
            return;
        }
        
        const character = this.threeJSCharacter.character;
        let animationApplied = false;
        
        // Method 1: Try to animate jaw bone
        character.traverse((child) => {
            if (child.isBone) {
                const name = child.name.toLowerCase();
                if (name.includes('jaw') || name.includes('mandible')) {
                    console.log('Animating jaw bone:', child.name);
                    // Animate jaw opening/closing - much more subtle
                    child.rotation.x = -intensity * 0.1; // Much smaller rotation
                    animationApplied = true;
                }
            }
        });
        
        // Method 2: Try morph targets/blend shapes
        if (character.morphTargetInfluences && character.morphTargetInfluences.length > 0) {
            console.log('Found morph targets, count:', character.morphTargetInfluences.length);
            
            // Try to find mouth-related morph targets by name
            let mouthMorphFound = false;
            character.traverse((child) => {
                if (child.isMesh && child.morphTargetInfluences) {
                    // Look for mouth-related morph targets
                    for (let i = 0; i < child.morphTargetInfluences.length; i++) {
                        const morphName = child.morphTargetDictionary ? 
                            Object.keys(child.morphTargetDictionary).find(key => 
                                child.morphTargetDictionary[key] === i
                            ) : null;
                        
                        if (morphName && (morphName.toLowerCase().includes('mouth') || 
                            morphName.toLowerCase().includes('jaw') || 
                            morphName.toLowerCase().includes('open'))) {
                            console.log('Found mouth morph target:', morphName);
                            child.morphTargetInfluences[i] = intensity;
                            mouthMorphFound = true;
                        }
                    }
                }
            });
            
            // If no specific mouth morphs found, try the first few morph targets
            if (!mouthMorphFound) {
                console.log('No specific mouth morphs found, trying general morphs');
                character.traverse((child) => {
                    if (child.isMesh && child.morphTargetInfluences) {
                        // Apply to first few morph targets - much more subtle
                        for (let i = 0; i < Math.min(2, child.morphTargetInfluences.length); i++) {
                            child.morphTargetInfluences[i] = intensity * 0.2; // Much smaller influence
                        }
                        animationApplied = true;
                    }
                });
            } else {
                animationApplied = true;
            }
        }
        
        // Method 3: Try to scale mouth area
        if (!animationApplied) {
            console.log('Trying mouth area scaling');
            character.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    if (name.includes('mouth') || name.includes('lip') || name.includes('head')) {
                        console.log('Scaling mouth area:', child.name);
                        // Scale mouth area based on intensity - much more subtle
                        child.scale.y = 1 + intensity * 0.05; // Much smaller scaling
                        child.scale.x = 1 + intensity * 0.03;
                        animationApplied = true;
                    }
                }
            });
        }
        
        // Method 4: Try to animate the entire character's mouth area
        if (!animationApplied) {
            console.log('Applying general mouth animation to character');
            // Try to find and animate any mouth-related geometry - very subtle
            character.traverse((child) => {
                if (child.isMesh && child.geometry) {
                    // Apply a very subtle scale to the entire mesh
                    child.scale.y = 1 + intensity * 0.02; // Much smaller
                    child.scale.x = 1 + intensity * 0.01;
                }
            });
            animationApplied = true;
        }
        
        if (animationApplied) {
            console.log(`✅ Mouth animation applied with intensity: ${intensity}`);
        } else {
            console.warn('❌ No mouth animation method worked');
        }
    }
    
    resetCamera() {
        if (this.threeJSCharacter) {
            this.threeJSCharacter.resetCamera();
        }
    }
    
    toggleAnimation() {
        if (!this.threeJSCharacter) return;
        
        if (this.currentAnimation === 'idle') {
            this.playAnimation('talking', true);
        } else {
            this.playAnimation('idle', true);
        }
    }
    
    testLipSync() {
        console.log('Testing lip sync...');
        
        // Create test viseme data with more dramatic changes
        const testVisemeData = {
            visemes: [
                { time: 0.0, viseme: 'viseme_aa' },
                { time: 0.5, viseme: 'viseme_ee' },
                { time: 1.0, viseme: 'viseme_ii' },
                { time: 1.5, viseme: 'viseme_oo' },
                { time: 2.0, viseme: 'viseme_uu' },
                { time: 2.5, viseme: 'viseme_sil' }
            ],
            duration: 3.0,
            text: 'Test lip sync'
        };
        
        console.log('Test viseme data:', testVisemeData);
        
        // Start lip sync with test data
        this.startLipSync(testVisemeData);
    }
    
    // Add a simple mouth animation test that's very visible
    testMouthAnimation() {
        console.log('Testing mouth animation directly...');
        
        if (!this.threeJSCharacter.character) {
            console.warn('Character not loaded');
            return;
        }
        
        const character = this.threeJSCharacter.character;
        let animationCount = 0;
        
        // Try to make the mouth move in a subtle but visible way
        character.traverse((child) => {
            if (child.isMesh) {
                console.log('Found mesh:', child.name);
                animationCount++;
                
                // Apply subtle scaling to make movement visible
                child.scale.y = 1.1; // Subtle height increase
                child.scale.x = 1.05; // Subtle width increase
                
                // Try to rotate it slightly
                child.rotation.z = 0.02; // Much smaller rotation
            }
        });
        
        console.log(`Applied animation to ${animationCount} meshes`);
        
        // Reset after 2 seconds
        setTimeout(() => {
            character.traverse((child) => {
                if (child.isMesh) {
                    child.scale.set(1, 1, 1);
                    child.rotation.z = 0;
                }
            });
            console.log('Reset character animation');
        }, 2000);
    }
    
    // Public methods for external control
    setTalkingState(isTalking) {
        if (isTalking) {
            this.setAnimationStatus('talking');
            this.playAnimation('talking', true);
        } else {
            this.setAnimationStatus('idle');
            this.playAnimation('idle', true);
        }
    }
    
    setThinkingState(isThinking) {
        if (isThinking) {
            this.setAnimationStatus('thinking');
            this.playAnimation('thinking', true);
        } else {
            this.setAnimationStatus('idle');
            this.playAnimation('idle', true);
        }
    }
    
    destroy() {
        if (this.threeJSCharacter) {
            this.threeJSCharacter.destroy();
        }
    }
}

// Export for use in other modules
window.CharacterManager = CharacterManager;
