// Lip-sync animation system for character
class LipSyncManager {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.isActive = false;
        this.currentViseme = null;
        this.visemeQueue = [];
        this.animationFrame = null;
    }
    
    startLipSync(visemeData) {
        if (!visemeData || !visemeData.visemes) {
            console.warn('No viseme data provided');
            return;
        }
        
        this.visemeQueue = [...visemeData.visemes];
        this.isActive = true;
        this.startTime = Date.now();
        
        console.log('Starting lip-sync with', this.visemeQueue.length, 'visemes');
        this.animate();
    }
    
    stopLipSync() {
        this.isActive = false;
        this.visemeQueue = [];
        this.currentViseme = null;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Reset character to idle state
        if (this.characterManager) {
            this.characterManager.setAnimationStatus('idle');
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        const currentTime = (Date.now() - this.startTime) / 1000;
        
        // Find the current viseme based on time
        let activeViseme = null;
        for (const viseme of this.visemeQueue) {
            if (viseme.time <= currentTime) {
                activeViseme = viseme;
            } else {
                break;
            }
        }
        
        // Apply the viseme if it's different from the current one
        if (activeViseme && activeViseme !== this.currentViseme) {
            this.applyViseme(activeViseme);
            this.currentViseme = activeViseme;
        }
        
        // Check if we've reached the end
        const lastViseme = this.visemeQueue[this.visemeQueue.length - 1];
        if (lastViseme && currentTime >= lastViseme.time + 0.5) { // Add small buffer
            this.stopLipSync();
            return;
        }
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    applyViseme(viseme) {
        console.log('LipSyncManager.applyViseme called with:', viseme);
        
        if (!this.characterManager) {
            console.warn('Character manager not available for viseme application');
            return;
        }
        
        if (!this.characterManager.threeJSCharacter) {
            console.warn('ThreeJS character not available for viseme application');
            return;
        }
        
        if (!this.characterManager.threeJSCharacter.character) {
            console.warn('Character model not loaded for viseme application');
            return;
        }
        
        const visemeName = viseme.viseme;
        const intensity = this.getVisemeIntensity(visemeName);
        
        console.log('Applying viseme:', visemeName, 'with intensity:', intensity);
        
        // Apply the viseme to the character
        this.animateCharacterMouth(intensity, visemeName);
    }
    getVisemeIntensity(visemeName) {
        // Realistic viseme intensities (0-1.0 range)
        const visemeIntensities = {
            'viseme_sil': 0.0,    // Silence
            'viseme_aa': 0.8,     // A sound - moderate open
            'viseme_kk': 0.2,     // K sound - very closed
            'viseme_nn': 0.4,     // N sound - slightly open
            'viseme_DD': 0.6,     // D sound - moderate pronounced
            'viseme_ff': 0.7,     // F sound - moderate lip touch
            'viseme_PP': 0.8,     // P sound - moderate lips together
            'viseme_rr': 0.7,     // R sound - moderate open
            'viseme_ss': 0.6,     // S sound - moderate open
            'viseme_th': 0.5,     // TH sound - moderate tongue out
            'viseme_oo': 1,     // O sound - moderate rounded
            'viseme_ee': 0.8,     // E sound - moderate smile
            'viseme_ii': 0.7,     // I sound - moderate smile
            'viseme_uu': 0.8,     // U sound - moderate pucker
        };
        
        return visemeIntensities[visemeName] || 0.0;
    }
    
    
    animateCharacterMouth(intensity, visemeName) {
        console.log('LipSyncManager.animateCharacterMouth called with intensity:', intensity, 'viseme:', visemeName);
        
        const character = this.characterManager.threeJSCharacter.character;
        if (!character) {
            console.warn('Character not available for mouth animation');
            return;
        }
        
        console.log('Character available, applying mouth animation');
        
        // This is where you would apply the viseme to your 3D character
        // The implementation depends on your character's rigging system
        
        // Example implementations for different character systems:
        
        // 1. Blend Shapes (Morph Targets)
        this.applyBlendShape(character, intensity, visemeName);
        
        // 2. Bone Animation
        this.applyBoneAnimation(character, intensity, visemeName);
        
        // 3. Custom mouth controller
        this.applyMouthController(character, intensity, visemeName);
    }
    
    applyBlendShape(character, intensity, visemeName) {
        console.log('LipSyncManager.applyBlendShape called');
        
        try {
            let animationApplied = false;
            
            // Look for mouth-related morph targets
            character.traverse((child) => {
                if (child.isMesh && child.morphTargetInfluences) {
                    console.log('Found mesh with morph targets:', child.name, 'count:', child.morphTargetInfluences.length);
                    
                    // Try to find mouth-related morph targets by name
                    for (let i = 0; i < child.morphTargetInfluences.length; i++) {
                        const morphName = child.morphTargetDictionary ? 
                            Object.keys(child.morphTargetDictionary).find(key => 
                                child.morphTargetDictionary[key] === i
                            ) : null;
                        
                        if (morphName && (morphName.toLowerCase().includes('mouth') || 
                            morphName.toLowerCase().includes('jaw') || 
                            morphName.toLowerCase().includes('open') ||
                            morphName.toLowerCase().includes('lip'))) {
                            console.log('Found mouth morph target:', morphName);
                            child.morphTargetInfluences[i] = intensity;
                            animationApplied = true;
                        }
                    }
                    
                    // If no specific mouth morphs found, try the first few morph targets
                    if (!animationApplied) {
                        console.log('No specific mouth morphs found, trying general morphs');
                        for (let i = 0; i < Math.min(3, child.morphTargetInfluences.length); i++) {
                            child.morphTargetInfluences[i] = intensity * 0.5;
                        }
                        animationApplied = true;
                    }
                }
            });
            
            if (animationApplied) {
                console.log('✅ Blend shape animation applied');
            } else {
                console.log('No morph targets found on character');
            }
        } catch (error) {
            console.warn('Blend shape application failed:', error);
        }
    }
    
    applyBoneAnimation(character, intensity, visemeName) {
        console.log('LipSyncManager.applyBoneAnimation called');
        
        try {
            let bonesFound = 0;
            character.traverse((child) => {
                if (child.isBone) {
                    const name = child.name.toLowerCase();
                    if (name.includes('jaw') || name.includes('mandible')) {
                        bonesFound++;
                        console.log('Found jaw bone:', child.name);
                        // Animate jaw bone - much more subtle
                        child.rotation.x = -intensity * 0.15; // Much smaller rotation
                        console.log('Applied jaw rotation:', child.rotation.x);
                    }
                    
                    if (name.includes('mouth') || name.includes('lip')) {
                        bonesFound++;
                        console.log('Found mouth/lip bone:', child.name);
                        // Animate mouth bones with subtle scaling
                        child.scale.y = 1 + intensity * 0.1;
                        child.scale.x = 1 + intensity * 0.05;
                        console.log('Applied mouth scale:', child.scale.x, child.scale.y);
                    }
                }
            });
            
            // If no specific bones found, try to animate any bones that might affect the mouth
            if (bonesFound === 0) {
                console.log('No specific mouth bones found, trying general bone animation');
                character.traverse((child) => {
                    if (child.isBone) {
                        const name = child.name.toLowerCase();
                        // Try to animate any bone that might be related to facial features
                        if (name.includes('head') || name.includes('face') || name.includes('skull')) {
                            console.log('Animating general head bone:', child.name);
                            child.rotation.x = -intensity * 0.05; // Much smaller
                            child.scale.y = 1 + intensity * 0.02; // Much smaller
                            bonesFound++;
                        }
                    }
                });
            }
            
            console.log('Total bones animated:', bonesFound);
        } catch (error) {
            console.warn('Bone animation application failed:', error);
        }
    }
    
    applyMouthController(character, intensity, visemeName) {
        // For custom mouth controller systems
        // This would be specific to your character's setup
        
        try {
            // Look for mouth controller in the character
            const mouthController = character.getObjectByName('MouthController');
            if (mouthController) {
                // Apply viseme to mouth controller
                mouthController.userData.viseme = visemeName;
                mouthController.userData.intensity = intensity;
                
                // Trigger custom mouth animation
                if (mouthController.userData.animate) {
                    mouthController.userData.animate(intensity, visemeName);
                }
            }
        } catch (error) {
            console.warn('Mouth controller application failed:', error);
        }
    }
    
    // Utility methods
    getVisemeDuration(visemeName) {
        // Return typical duration for different visemes
        const durations = {
            'viseme_sil': 0.1,
            'viseme_aa': 0.2,
            'viseme_kk': 0.1,
            'viseme_nn': 0.15,
            'viseme_DD': 0.1,
            'viseme_ff': 0.2,
            'viseme_PP': 0.15,
            'viseme_rr': 0.2,
            'viseme_ss': 0.3,
        };
        
        return durations[visemeName] || 0.1;
    }
    
    // Debug methods
    logVisemeData(visemeData) {
        console.log('Viseme data:', visemeData);
        console.log('Total visemes:', visemeData.visemes?.length || 0);
        console.log('Duration:', visemeData.duration || 0);
    }
}

// Export for use in other modules
window.LipSyncManager = LipSyncManager;
