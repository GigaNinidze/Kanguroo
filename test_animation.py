#!/usr/bin/env python3
"""
Test file for animation logic - generates test viseme data
"""

import json
import time
import random

class AnimationTester:
    def __init__(self):
        self.test_phrases = [
            "Hello, how are you today?",
            "Welcome to Kan-guroo!",
            "I can help you with educational programs.",
            "What would you like to know?",
            "Let me tell you about our exchange programs.",
            "We offer amazing opportunities for students.",
            "Contact us for more information.",
            "Thank you for your interest!"
        ]
        
        # Viseme mapping for different sounds
        self.viseme_map = {
            'A': 'viseme_aa', 'B': 'viseme_PP', 'C': 'viseme_kk', 'D': 'viseme_DD',
            'E': 'viseme_ee', 'F': 'viseme_ff', 'G': 'viseme_kk', 'H': 'viseme_aa',
            'I': 'viseme_ii', 'J': 'viseme_DD', 'K': 'viseme_kk', 'L': 'viseme_nn',
            'M': 'viseme_PP', 'N': 'viseme_nn', 'O': 'viseme_oo', 'P': 'viseme_PP',
            'Q': 'viseme_kk', 'R': 'viseme_rr', 'S': 'viseme_ss', 'T': 'viseme_DD',
            'U': 'viseme_uu', 'V': 'viseme_ff', 'W': 'viseme_aa', 'X': 'viseme_kk',
            'Y': 'viseme_ii', 'Z': 'viseme_ss'
        }
    
    def generate_test_viseme_data(self, text="Hello, this is a test!"):
        """Generate test viseme data for animation testing"""
        print(f"🎭 Generating test viseme data for: '{text}'")
        
        visemes = []
        current_time = 0.0
        duration_per_char = 0.12  # 120ms per character
        
        for char in text.upper():
            if char in self.viseme_map:
                viseme = {
                    'time': current_time,
                    'viseme': self.viseme_map[char]
                }
                visemes.append(viseme)
                print(f"  {char} -> {viseme['viseme']} at {viseme['time']:.2f}s")
            current_time += duration_per_char
        
        # Add silence at the end
        visemes.append({
            'time': current_time,
            'viseme': 'viseme_sil'
        })
        
        result = {
            'visemes': visemes,
            'duration': current_time,
            'text': text,
            'test_mode': True
        }
        
        print(f"✅ Generated {len(visemes)} visemes over {current_time:.2f}s")
        return result
    
    def generate_exaggerated_viseme_data(self, text="Hello, this is a test!"):
        """Generate exaggerated viseme data for dramatic animation"""
        print(f"🎭 Generating EXAGGERATED viseme data for: '{text}'")
        
        visemes = []
        current_time = 0.0
        duration_per_char = 0.15  # Slower for more dramatic effect
        
        for char in text.upper():
            if char in self.viseme_map:
                viseme = {
                    'time': current_time,
                    'viseme': self.viseme_map[char]
                }
                visemes.append(viseme)
                print(f"  {char} -> {viseme['viseme']} at {viseme['time']:.2f}s")
            current_time += duration_per_char
        
        # Add dramatic pause
        visemes.append({
            'time': current_time,
            'viseme': 'viseme_sil'
        })
        
        result = {
            'visemes': visemes,
            'duration': current_time,
            'text': text,
            'test_mode': True,
            'exaggerated': True
        }
        
        print(f"✅ Generated {len(visemes)} EXAGGERATED visemes over {current_time:.2f}s")
        return result
    
    def generate_random_test_phrase(self):
        """Generate a random test phrase"""
        return random.choice(self.test_phrases)
    
    def test_viseme_frequency(self, text):
        """Analyze viseme frequency in text"""
        viseme_count = {}
        for char in text.upper():
            if char in self.viseme_map:
                viseme = self.viseme_map[char]
                viseme_count[viseme] = viseme_count.get(viseme, 0) + 1
        
        print(f"📊 Viseme frequency analysis for '{text}':")
        for viseme, count in sorted(viseme_count.items()):
            print(f"  {viseme}: {count} times")
        
        return viseme_count

def main():
    """Test the animation logic"""
    print("🧪 ANIMATION TESTER")
    print("=" * 50)
    
    tester = AnimationTester()
    
    # Test 1: Basic viseme generation
    print("\n🎬 Test 1: Basic Viseme Generation")
    test_text = "Hello World!"
    viseme_data = tester.generate_test_viseme_data(test_text)
    
    # Test 2: Exaggerated viseme generation
    print("\n🎭 Test 2: Exaggerated Viseme Generation")
    exaggerated_data = tester.generate_exaggerated_viseme_data(test_text)
    
    # Test 3: Frequency analysis
    print("\n📊 Test 3: Frequency Analysis")
    tester.test_viseme_frequency(test_text)
    
    # Test 4: Random phrase
    print("\n🎲 Test 4: Random Phrase")
    random_phrase = tester.generate_random_test_phrase()
    print(f"Random phrase: '{random_phrase}")
    random_viseme_data = tester.generate_test_viseme_data(random_phrase)
    
    print("\n✅ All tests completed!")
    return viseme_data

if __name__ == '__main__':
    main()
