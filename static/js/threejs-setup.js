// Three.js setup for 3D character rendering
class ThreeJSCharacter {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        this.isAnimating = false;
        this.controls = null;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.loadCharacter();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f7fa);
    }
    
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0.2);
        this.camera.lookAt(0, 1.6, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 8;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target.set(0, 1.6, 0);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
        rimLight.position.set(0, 5, -10);
        this.scene.add(rimLight);
    }
    
    async loadCharacter() {
        try {
            const loader = new THREE.GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    '/Dona.glb',
                    resolve,
                    (progress) => {
                        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                    },
                    reject
                );
            });
            
            this.character = gltf.scene;
            this.character.scale.setScalar(1);
            this.character.position.set(0, 0, 0);
            this.character.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            this.scene.add(this.character);
            
            // Setup animations
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.character);
                
                gltf.animations.forEach((clip) => {
                    this.animations[clip.name] = clip;
                });
                
                // Play idle animation by default
                this.playAnimation('idle', true);
            }
            
            console.log('Character loaded successfully');
            this.onCharacterLoaded();
            
        } catch (error) {
            console.error('Error loading character:', error);
            this.onCharacterLoadError(error);
        }
    }
    
    playAnimation(animationName, loop = true) {
        if (!this.mixer || !this.animations[animationName]) {
            console.warn(`Animation '${animationName}' not found`);
            return;
        }
        
        if (this.currentAnimation) {
            this.mixer.stopAllAction();
        }
        
        const action = this.mixer.clipAction(this.animations[animationName]);
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
        action.reset();
        action.play();
        
        this.currentAnimation = action;
        this.isAnimating = true;
        
        console.log(`Playing animation: ${animationName}`);
    }
    
    stopAnimation() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        this.isAnimating = false;
        this.currentAnimation = null;
    }
    
    updateAnimation(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = 0.016; // Approximate 60fps
        this.updateAnimation(deltaTime);
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    resetCamera() {
        if (this.controls) {
            this.controls.reset();
        }
    }
    
    // Event callbacks (to be overridden)
    onCharacterLoaded() {
        console.log('Character loaded callback');
    }
    
    onCharacterLoadError(error) {
        console.error('Character load error callback:', error);
    }
    
    // Public methods for external control
    setAnimationStatus(status) {
        const statusElement = document.getElementById('animationStatus');
        if (statusElement) {
            const dot = statusElement.querySelector('.status-dot');
            const text = statusElement.querySelector('span:last-child');
            
            dot.className = `status-dot ${status}`;
            text.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
    }
}

// Export for use in other modules
window.ThreeJSCharacter = ThreeJSCharacter;
