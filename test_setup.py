#!/usr/bin/env python3
"""
Test script to verify Kan-guroo Web App setup
"""

import os
import sys
import json
from pathlib import Path

def test_file_structure():
    """Test if all required files exist"""
    print("🔍 Checking file structure...")
    
    required_files = [
        'app.py',
        'config.py',
        'gemini_service.py',
        'elevenlabs_service.py',
        'performance_monitor.py',
        'requirements.txt',
        'faq_data.json',
        'Dona.glb',
        'templates/index.html',
        'static/css/style.css',
        'static/js/app.js',
        'static/js/chat.js',
        'static/js/character.js',
        'static/js/lipsync.js',
        'static/js/threejs-setup.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    else:
        print("✅ All required files present")
        return True

def test_dependencies():
    """Test if required Python packages are available"""
    print("\n🔍 Checking Python dependencies...")
    
    required_packages = [
        'flask',
        'flask_cors',
        'google.generativeai',
        'aiohttp',
        'asyncio'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n💡 Install with: pip install -r requirements.txt")
        return False
    else:
        print("✅ All required packages available")
        return True

def test_config():
    """Test configuration setup"""
    print("\n🔍 Checking configuration...")
    
    try:
        from config import GEMINI_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
        
        if GEMINI_API_KEY == 'your_gemini_api_key_here':
            print("⚠️  GEMINI_API_KEY not configured")
            return False
        
        if ELEVENLABS_API_KEY == 'your_elevenlabs_api_key_here':
            print("⚠️  ELEVENLABS_API_KEY not configured")
            return False
            
        if ELEVENLABS_VOICE_ID == 'your_voice_id_here':
            print("⚠️  ELEVENLABS_VOICE_ID not configured")
            return False
        
        print("✅ Configuration looks good")
        return True
        
    except ImportError as e:
        print(f"❌ Configuration error: {e}")
        return False

def test_faq_data():
    """Test FAQ data structure"""
    print("\n🔍 Checking FAQ data...")
    
    try:
        with open('faq_data.json', 'r', encoding='utf-8') as f:
            faq_data = json.load(f)
        
        required_keys = ['company']
        company_keys = ['name', 'website', 'description', 'mission', 'vision', 'team', 'programs', 'contact']
        
        for key in required_keys:
            if key not in faq_data:
                print(f"❌ Missing key in FAQ data: {key}")
                return False
        
        company = faq_data['company']
        for key in company_keys:
            if key not in company:
                print(f"❌ Missing key in company data: {key}")
                return False
        
        print("✅ FAQ data structure is valid")
        return True
        
    except Exception as e:
        print(f"❌ FAQ data error: {e}")
        return False

def test_character_model():
    """Test if character model exists and is accessible"""
    print("\n🔍 Checking character model...")
    
    if not os.path.exists('Dona.glb'):
        print("❌ Character model 'Dona.glb' not found")
        return False
    
    file_size = os.path.getsize('Dona.glb')
    if file_size < 1000:  # Less than 1KB is suspicious
        print("⚠️  Character model file seems too small")
        return False
    
    print(f"✅ Character model found ({file_size:,} bytes)")
    return True

def main():
    """Run all tests"""
    print("🚀 Kan-guroo Web App Setup Test")
    print("=" * 50)
    
    tests = [
        test_file_structure,
        test_dependencies,
        test_config,
        test_faq_data,
        test_character_model
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your setup is ready.")
        print("\n🚀 To start the application:")
        print("   python app.py")
        print("\n🌐 Then open: http://localhost:5001")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == '__main__':
    main()

