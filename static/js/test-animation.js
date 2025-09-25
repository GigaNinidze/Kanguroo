// Test Animation functionality
class TestAnimation {
    constructor() {
        this.testPhrases = [
            "Hello, how are you today?",
            "Welcome to Kan-guroo!",
            "I can help you with educational programs.",
            "What would you like to know?",
            "Let me tell you about our exchange programs.",
            "We offer amazing opportunities for students.",
            "Contact us for more information.",
            "Thank you for your interest!"
        ];
        
        this.visemeMap = {
            'A': 'viseme_aa', 'B': 'viseme_PP', 'C': 'viseme_kk', 'D': 'viseme_DD',
            'E': 'viseme_ee', 'F': 'viseme_ff', 'G': 'viseme_kk', 'H': 'viseme_aa',
            'I': 'viseme_ii', 'J': 'viseme_DD', 'K': 'viseme_kk', 'L': 'viseme_nn',
            'M': 'viseme_PP', 'N': 'viseme_nn', 'O': 'viseme_oo', 'P': 'viseme_PP',
            'Q': 'viseme_kk', 'R': 'viseme_rr', 'S': 'viseme_ss', 'T': 'viseme_DD',
            'U': 'viseme_uu', 'V': 'viseme_ff', 'W': 'viseme_aa', 'X': 'viseme_kk',
            'Y': 'viseme_ii', 'Z': 'viseme_ss'
        };
        
        this.init();
    }
    
    init() {
        this.createTestButton();
        this.setupEventListeners();
    }
    
    createTestButton() {
        // Create test button
        const testButton = document.createElement('button');
        testButton.id = 'testAnimation';
        testButton.className = 'control-button';
        testButton.title = 'Test animation';
        testButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 5v14l11-7z"></path>
            </svg>
        `;
        
        // Add to character controls
        const controls = document.querySelector('.character-controls');
        if (controls) {
            controls.appendChild(testButton);
        }
        
        // Add test panel
        this.createTestPanel();
    }
    
    createTestPanel() {
        const testPanel = document.createElement('div');
        testPanel.id = 'testPanel';
        testPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            font-family: monospace;
            font-size: 12px;
            display: none;
        `;
        
        testPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #FA8148;">🧪 Animation Test Panel</h3>
            <div>
                <label>Test Phrase:</label><br>
                <select id="testPhraseSelect" style="width: 100%; margin: 5px 0;">
                    <option value="custom">Custom text...</option>
                </select>
                <input type="text" id="customPhrase" placeholder="Enter custom text..." style="width: 100%; margin: 5px 0; padding: 5px;">
            </div>
            <div>
                <label>Animation Type:</label><br>
                <select id="animationType" style="width: 100%; margin: 5px 0;">
                    <option value="normal">Normal</option>
                    <option value="exaggerated">Exaggerated</option>
                    <option value="slow">Slow</option>
                    <option value="fast">Fast</option>
                </select>
            </div>
            <div style="margin: 10px 0;">
                <button id="runTest" style="background: #FA8148; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Run Test</button>
                <button id="closePanel" style="background: #666; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
            <div id="testResults" style="margin-top: 10px; font-size: 10px;"></div>
        `;
        
        document.body.appendChild(testPanel);
        
        // Populate test phrases
        const select = testPanel.querySelector('#testPhraseSelect');
        this.testPhrases.forEach((phrase, index) => {
            const option = document.createElement('option');
            option.value = phrase;
            option.textContent = phrase;
            select.appendChild(option);
        });
    }
    
    setupEventListeners() {
        // Test button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('#testAnimation')) {
                this.toggleTestPanel();
            }
        });
        
        // Run test button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'runTest') {
                this.runAnimationTest();
            }
        });
        
        // Close panel
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closePanel') {
                this.closeTestPanel();
            }
        });
        
        // Custom phrase input
        document.addEventListener('input', (e) => {
            if (e.target.id === 'customPhrase') {
                const select = document.getElementById('testPhraseSelect');
                if (e.target.value) {
                    select.value = 'custom';
                }
            }
        });
    }
    
    toggleTestPanel() {
        const panel = document.getElementById('testPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
    
    closeTestPanel() {
        const panel = document.getElementById('testPanel');
        panel.style.display = 'none';
    }
    
    runAnimationTest() {
        const select = document.getElementById('testPhraseSelect');
        const customInput = document.getElementById('customPhrase');
        const animationType = document.getElementById('animationType').value;
        const results = document.getElementById('testResults');
        
        let testText = select.value;
        if (testText === 'custom') {
            testText = customInput.value;
        }
        
        if (!testText.trim()) {
            results.innerHTML = '<span style="color: #ff6b6b;">Please enter test text!</span>';
            return;
        }
        
        console.log('🧪 Running animation test with:', testText);
        results.innerHTML = `<span style="color: #4ecdc4;">Testing: "${testText}"</span>`;
        
        // Generate viseme data
        const visemeData = this.generateVisemeData(testText, animationType);
        
        // Start lip-sync animation
        if (window.lipSyncManager) {
            window.lipSyncManager.startLipSync(visemeData);
            results.innerHTML += '<br><span style="color: #45b7d1;">✅ Animation started!</span>';
        } else {
            results.innerHTML += '<br><span style="color: #ff6b6b;">❌ Lip-sync manager not available</span>';
        }
    }
    
    generateVisemeData(text, animationType = 'normal') {
        console.log(`🎭 Generating ${animationType} viseme data for: "${text}"`);
        
        const visemes = [];
        let currentTime = 0.0;
        let durationPerChar = 0.12; // Default 120ms per character
        
        // Adjust timing based on animation type
        switch (animationType) {
            case 'slow':
                durationPerChar = 0.2;
                break;
            case 'fast':
                durationPerChar = 0.08;
                break;
            case 'exaggerated':
                durationPerChar = 0.15;
                break;
        }
        
        for (const char of text.toUpperCase()) {
            if (char in this.visemeMap) {
                const viseme = {
                    time: currentTime,
                    viseme: this.visemeMap[char]
                };
                visemes.push(viseme);
                console.log(`  ${char} -> ${viseme.viseme} at ${viseme.time.toFixed(2)}s`);
            }
            currentTime += durationPerChar;
        }
        
        // Add silence at the end
        visemes.push({
            time: currentTime,
            viseme: 'viseme_sil'
        });
        
        const result = {
            visemes: visemes,
            duration: currentTime,
            text: text,
            test_mode: true,
            animation_type: animationType
        };
        
        console.log(`✅ Generated ${visemes.length} visemes over ${currentTime.toFixed(2)}s`);
        return result;
    }
}

// Initialize test animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testAnimation = new TestAnimation();
});

// Export for global access
window.TestAnimation = TestAnimation;
