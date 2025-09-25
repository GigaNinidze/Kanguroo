🎭 Viseme Data Structure Test
==================================================
This script shows developers exactly how viseme data is structured
and how it can be used for 3D character lip-sync animation
==================================================

🎭 Viseme Reference Guide
==================================================
📚 Complete Viseme Reference:

  viseme_sil:
    Description: Silence - closed mouth
    Intensity: 0.0
    Use Case: Pauses, silence between words

  viseme_aa:
    Description: A sound - open mouth
    Intensity: 0.8
    Use Case: Words like "cat", "hat", "bat"

  viseme_ee:
    Description: E sound - smile shape
    Intensity: 0.8
    Use Case: Words like "see", "tree", "free"

  viseme_ii:
    Description: I sound - narrow smile
    Intensity: 0.7
    Use Case: Words like "bit", "sit", "fit"

  viseme_oo:
    Description: O sound - rounded lips
    Intensity: 1.0
    Use Case: Words like "boat", "coat", "note"

  viseme_uu:
    Description: U sound - puckered lips
    Intensity: 0.8
    Use Case: Words like "boot", "suit", "fruit"

  viseme_kk:
    Description: K sound - closed mouth
    Intensity: 0.2
    Use Case: Words like "cat", "key", "back"

  viseme_PP:
    Description: P sound - lips together
    Intensity: 0.8
    Use Case: Words like "pat", "pet", "put"

  viseme_ff:
    Description: F sound - lip touch
    Intensity: 0.7
    Use Case: Words like "fish", "off", "tough"

  viseme_DD:
    Description: D sound - tongue touch
    Intensity: 0.6
    Use Case: Words like "dog", "bed", "red"

  viseme_ss:
    Description: S sound - narrow opening
    Intensity: 0.6
    Use Case: Words like "snake", "pass", "miss"

💻 Frontend Implementation Example
==================================================
🔧 JavaScript Implementation:

// Example: How to use viseme data in JavaScript
function startLipSync(visemeData) {
    const visemes = visemeData.visemes;
    const startTime = Date.now();
    
    function animateViseme() {
        const currentTime = (Date.now() - startTime) / 1000;
        
        // Find current viseme based on time
        let currentViseme = null;
        for (const viseme of visemes) {
            if (viseme.time <= currentTime) {
                currentViseme = viseme;
            } else {
                break;
            }
        }
        
        // Apply viseme to 3D character
        if (currentViseme) {
            applyVisemeToCharacter(currentViseme.viseme);
        }
        
        // Continue animation if not finished
        if (currentTime < visemeData.duration) {
            requestAnimationFrame(animateViseme);
        }
    }
    
    animateViseme();
}

function applyVisemeToCharacter(visemeName) {
    // Map viseme to mouth shape intensity
    const visemeIntensity = getVisemeIntensity(visemeName);
    
    // Apply to character (example methods)
    // Method 1: Blend shapes
    character.morphTargetInfluences[mouthBlendIndex] = visemeIntensity;
    
    // Method 2: Bone animation
    character.jawBone.rotation.x = -visemeIntensity * 0.1;
    
    // Method 3: Scaling
    character.mouthArea.scale.y = 1 + visemeIntensity * 0.1;
}

🎭 Viseme Data Structure Test
==================================================

📝 Test 1: 'Hello, how are you today?'
------------------------------
ElevenLabs TTS time: 430.05ms
✅ Viseme data generated successfully
📊 Structure:
  • Total visemes: 19
  • Duration: 2.50 seconds
  • Original text: 'Hello, how are you today?'

🔧 Raw Viseme Data (JSON):
{
  "visemes": [
    {
      "time": 0.0,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.1,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.2,
      "viseme": "viseme_nn"
    },
    {
      "time": 0.30000000000000004,
      "viseme": "viseme_nn"
    },
    {
      "time": 0.4,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.7,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.7999999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.8999999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.0999999999999999,
      "viseme": "viseme_sil"
    },
    {
      "time": 1.2,
      "viseme": "viseme_rr"
    },
    {
      "time": 1.3,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.5000000000000002,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.6000000000000003,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.7000000000000004,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.9000000000000006,
      "viseme": "viseme_DD"
    },
    {
      "time": 2.0000000000000004,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.1000000000000005,
      "viseme": "viseme_DD"
    },
    {
      "time": 2.2000000000000006,
      "viseme": "viseme_sil"
    },
    {
      "time": 2.3000000000000007,
      "viseme": "viseme_aa"
    }
  ],
  "duration": 2.500000000000001,
  "text": "Hello, how are you today?"
}

📋 Viseme Breakdown:
   1. Time: 0.00s → Viseme: viseme_aa
   2. Time: 0.10s → Viseme: viseme_aa
   3. Time: 0.20s → Viseme: viseme_nn
   4. Time: 0.30s → Viseme: viseme_nn
   5. Time: 0.40s → Viseme: viseme_aa
   6. Time: 0.70s → Viseme: viseme_aa
   7. Time: 0.80s → Viseme: viseme_aa
   8. Time: 0.90s → Viseme: viseme_aa
   9. Time: 1.10s → Viseme: viseme_sil
  10. Time: 1.20s → Viseme: viseme_rr
  11. Time: 1.30s → Viseme: viseme_aa
  12. Time: 1.50s → Viseme: viseme_aa
  13. Time: 1.60s → Viseme: viseme_aa
  14. Time: 1.70s → Viseme: viseme_aa
  15. Time: 1.90s → Viseme: viseme_DD
  16. Time: 2.00s → Viseme: viseme_aa
  17. Time: 2.10s → Viseme: viseme_DD
  18. Time: 2.20s → Viseme: viseme_sil
  19. Time: 2.30s → Viseme: viseme_aa

📈 Viseme Frequency:
  viseme_DD: 2 times (10.5%)
  viseme_aa: 12 times (63.2%)
  viseme_nn: 2 times (10.5%)
  viseme_rr: 1 times (5.3%)
  viseme_sil: 2 times (10.5%)

==================================================

📝 Test 2: 'Welcome to Kan-Guroo educational programs!'
------------------------------
ElevenLabs TTS time: 446.37ms
✅ Viseme data generated successfully
📊 Structure:
  • Total visemes: 36
  • Duration: 4.20 seconds
  • Original text: 'Welcome to Kan-Guroo educational programs!'

🔧 Raw Viseme Data (JSON):
{
  "visemes": [
    {
      "time": 0.0,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.1,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.2,
      "viseme": "viseme_nn"
    },
    {
      "time": 0.30000000000000004,
      "viseme": "viseme_kk"
    },
    {
      "time": 0.4,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.5,
      "viseme": "viseme_PP"
    },
    {
      "time": 0.6,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.7999999999999999,
      "viseme": "viseme_DD"
    },
    {
      "time": 0.8999999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.0999999999999999,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.2,
      "viseme": "viseme_sil"
    },
    {
      "time": 1.3,
      "viseme": "viseme_nn"
    },
    {
      "time": 1.5000000000000002,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.6000000000000003,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.7000000000000004,
      "viseme": "viseme_rr"
    },
    {
      "time": 1.8000000000000005,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.9000000000000006,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.1000000000000005,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.2000000000000006,
      "viseme": "viseme_DD"
    },
    {
      "time": 2.3000000000000007,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.400000000000001,
      "viseme": "viseme_kk"
    },
    {
      "time": 2.500000000000001,
      "viseme": "viseme_sil"
    },
    {
      "time": 2.600000000000001,
      "viseme": "viseme_DD"
    },
    {
      "time": 2.700000000000001,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.800000000000001,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.9000000000000012,
      "viseme": "viseme_nn"
    },
    {
      "time": 3.0000000000000013,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.1000000000000014,
      "viseme": "viseme_nn"
    },
    {
      "time": 3.3000000000000016,
      "viseme": "viseme_PP"
    },
    {
      "time": 3.4000000000000017,
      "viseme": "viseme_rr"
    },
    {
      "time": 3.5000000000000018,
      "viseme": "viseme_aa"
    },
    {
      "time": 3.600000000000002,
      "viseme": "viseme_kk"
    },
    {
      "time": 3.700000000000002,
      "viseme": "viseme_rr"
    },
    {
      "time": 3.800000000000002,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.900000000000002,
      "viseme": "viseme_PP"
    },
    {
      "time": 4.000000000000002,
      "viseme": "viseme_ss"
    }
  ],
  "duration": 4.200000000000001,
  "text": "Welcome to Kan-Guroo educational programs!"
}

📋 Viseme Breakdown:
   1. Time: 0.00s → Viseme: viseme_aa
   2. Time: 0.10s → Viseme: viseme_aa
   3. Time: 0.20s → Viseme: viseme_nn
   4. Time: 0.30s → Viseme: viseme_kk
   5. Time: 0.40s → Viseme: viseme_aa
   6. Time: 0.50s → Viseme: viseme_PP
   7. Time: 0.60s → Viseme: viseme_aa
   8. Time: 0.80s → Viseme: viseme_DD
   9. Time: 0.90s → Viseme: viseme_aa
  10. Time: 1.10s → Viseme: viseme_kk
  11. Time: 1.20s → Viseme: viseme_sil
  12. Time: 1.30s → Viseme: viseme_nn
  13. Time: 1.50s → Viseme: viseme_kk
  14. Time: 1.60s → Viseme: viseme_aa
  15. Time: 1.70s → Viseme: viseme_rr
  16. Time: 1.80s → Viseme: viseme_aa
  17. Time: 1.90s → Viseme: viseme_aa
  18. Time: 2.10s → Viseme: viseme_aa
  19. Time: 2.20s → Viseme: viseme_DD
  20. Time: 2.30s → Viseme: viseme_aa
  21. Time: 2.40s → Viseme: viseme_kk
  22. Time: 2.50s → Viseme: viseme_sil
  23. Time: 2.60s → Viseme: viseme_DD
  24. Time: 2.70s → Viseme: viseme_aa
  25. Time: 2.80s → Viseme: viseme_aa
  26. Time: 2.90s → Viseme: viseme_nn
  27. Time: 3.00s → Viseme: viseme_sil
  28. Time: 3.10s → Viseme: viseme_nn
  29. Time: 3.30s → Viseme: viseme_PP
  30. Time: 3.40s → Viseme: viseme_rr
  31. Time: 3.50s → Viseme: viseme_aa
  32. Time: 3.60s → Viseme: viseme_kk
  33. Time: 3.70s → Viseme: viseme_rr
  34. Time: 3.80s → Viseme: viseme_sil
  35. Time: 3.90s → Viseme: viseme_PP
  36. Time: 4.00s → Viseme: viseme_ss

📈 Viseme Frequency:
  viseme_DD: 3 times (8.3%)
  viseme_PP: 3 times (8.3%)
  viseme_aa: 13 times (36.1%)
  viseme_kk: 5 times (13.9%)
  viseme_nn: 4 times (11.1%)
  viseme_rr: 3 times (8.3%)
  viseme_sil: 4 times (11.1%)
  viseme_ss: 1 times (2.8%)

==================================================

📝 Test 3: 'We offer exchange programs in the USA and Europe.'
------------------------------
ElevenLabs TTS time: 439.93ms
✅ Viseme data generated successfully
📊 Structure:
  • Total visemes: 40
  • Duration: 4.90 seconds
  • Original text: 'We offer exchange programs in the USA and Europe.'

🔧 Raw Viseme Data (JSON):
{
  "visemes": [
    {
      "time": 0.0,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.1,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.30000000000000004,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.4,
      "viseme": "viseme_ff"
    },
    {
      "time": 0.5,
      "viseme": "viseme_ff"
    },
    {
      "time": 0.6,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.7,
      "viseme": "viseme_rr"
    },
    {
      "time": 0.8999999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.9999999999999999,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.0999999999999999,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.2,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.3,
      "viseme": "viseme_sil"
    },
    {
      "time": 1.4000000000000001,
      "viseme": "viseme_nn"
    },
    {
      "time": 1.5000000000000002,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.6000000000000003,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.8000000000000005,
      "viseme": "viseme_PP"
    },
    {
      "time": 1.9000000000000006,
      "viseme": "viseme_rr"
    },
    {
      "time": 2.0000000000000004,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.1000000000000005,
      "viseme": "viseme_kk"
    },
    {
      "time": 2.2000000000000006,
      "viseme": "viseme_rr"
    },
    {
      "time": 2.3000000000000007,
      "viseme": "viseme_sil"
    },
    {
      "time": 2.400000000000001,
      "viseme": "viseme_PP"
    },
    {
      "time": 2.500000000000001,
      "viseme": "viseme_ss"
    },
    {
      "time": 2.700000000000001,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.800000000000001,
      "viseme": "viseme_nn"
    },
    {
      "time": 3.0000000000000013,
      "viseme": "viseme_DD"
    },
    {
      "time": 3.1000000000000014,
      "viseme": "viseme_aa"
    },
    {
      "time": 3.2000000000000015,
      "viseme": "viseme_aa"
    },
    {
      "time": 3.4000000000000017,
      "viseme": "viseme_aa"
    },
    {
      "time": 3.5000000000000018,
      "viseme": "viseme_ss"
    },
    {
      "time": 3.600000000000002,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.800000000000002,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.900000000000002,
      "viseme": "viseme_nn"
    },
    {
      "time": 4.000000000000002,
      "viseme": "viseme_DD"
    },
    {
      "time": 4.200000000000001,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.300000000000001,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.4,
      "viseme": "viseme_rr"
    },
    {
      "time": 4.5,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.6,
      "viseme": "viseme_PP"
    },
    {
      "time": 4.699999999999999,
      "viseme": "viseme_aa"
    }
  ],
  "duration": 4.899999999999999,
  "text": "We offer exchange programs in the USA and Europe."
}

📋 Viseme Breakdown:
   1. Time: 0.00s → Viseme: viseme_aa
   2. Time: 0.10s → Viseme: viseme_aa
   3. Time: 0.30s → Viseme: viseme_aa
   4. Time: 0.40s → Viseme: viseme_ff
   5. Time: 0.50s → Viseme: viseme_ff
   6. Time: 0.60s → Viseme: viseme_aa
   7. Time: 0.70s → Viseme: viseme_rr
   8. Time: 0.90s → Viseme: viseme_aa
   9. Time: 1.00s → Viseme: viseme_kk
  10. Time: 1.10s → Viseme: viseme_kk
Unclosed client session
client_session: <aiohttp.client.ClientSession object at 0x1024081f0>
Unclosed connector
connections: ['[(<aiohttp.client_proto.ResponseHandler object at 0x10241a440>, 123497.9637055)]']
connector: <aiohttp.connector.TCPConnector object at 0x102408100>
  11. Time: 1.20s → Viseme: viseme_aa
  12. Time: 1.30s → Viseme: viseme_sil
  13. Time: 1.40s → Viseme: viseme_nn
  14. Time: 1.50s → Viseme: viseme_kk
  15. Time: 1.60s → Viseme: viseme_aa
  16. Time: 1.80s → Viseme: viseme_PP
  17. Time: 1.90s → Viseme: viseme_rr
  18. Time: 2.00s → Viseme: viseme_aa
  19. Time: 2.10s → Viseme: viseme_kk
  20. Time: 2.20s → Viseme: viseme_rr
  21. Time: 2.30s → Viseme: viseme_sil
  22. Time: 2.40s → Viseme: viseme_PP
  23. Time: 2.50s → Viseme: viseme_ss
  24. Time: 2.70s → Viseme: viseme_aa
  25. Time: 2.80s → Viseme: viseme_nn
  26. Time: 3.00s → Viseme: viseme_DD
  27. Time: 3.10s → Viseme: viseme_aa
  28. Time: 3.20s → Viseme: viseme_aa
  29. Time: 3.40s → Viseme: viseme_aa
  30. Time: 3.50s → Viseme: viseme_ss
  31. Time: 3.60s → Viseme: viseme_sil
  32. Time: 3.80s → Viseme: viseme_sil
  33. Time: 3.90s → Viseme: viseme_nn
  34. Time: 4.00s → Viseme: viseme_DD
  35. Time: 4.20s → Viseme: viseme_aa
  36. Time: 4.30s → Viseme: viseme_aa
  37. Time: 4.40s → Viseme: viseme_rr
  38. Time: 4.50s → Viseme: viseme_aa
  39. Time: 4.60s → Viseme: viseme_PP
  40. Time: 4.70s → Viseme: viseme_aa

📈 Viseme Frequency:
  viseme_DD: 2 times (5.0%)
  viseme_PP: 3 times (7.5%)
  viseme_aa: 16 times (40.0%)
  viseme_ff: 2 times (5.0%)
  viseme_kk: 4 times (10.0%)
  viseme_nn: 3 times (7.5%)
  viseme_rr: 4 times (10.0%)
  viseme_sil: 4 times (10.0%)
  viseme_ss: 2 times (5.0%)

==================================================

📝 Test 4: 'Our team includes Otari, Saba, and Lasha as founders.'
------------------------------
ElevenLabs TTS time: 595.77ms
✅ Viseme data generated successfully
📊 Structure:
  • Total visemes: 42
  • Duration: 5.30 seconds
  • Original text: 'Our team includes Otari, Saba, and Lasha as founders.'

🔧 Raw Viseme Data (JSON):
{
  "visemes": [
    {
      "time": 0.0,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.1,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.2,
      "viseme": "viseme_rr"
    },
    {
      "time": 0.4,
      "viseme": "viseme_DD"
    },
    {
      "time": 0.5,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.6,
      "viseme": "viseme_sil"
    },
    {
      "time": 0.7,
      "viseme": "viseme_PP"
    },
    {
      "time": 0.8999999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 0.9999999999999999,
      "viseme": "viseme_nn"
    },
    {
      "time": 1.0999999999999999,
      "viseme": "viseme_kk"
    },
    {
      "time": 1.2,
      "viseme": "viseme_nn"
    },
    {
      "time": 1.3,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.4000000000000001,
      "viseme": "viseme_DD"
    },
    {
      "time": 1.5000000000000002,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.6000000000000003,
      "viseme": "viseme_ss"
    },
    {
      "time": 1.8000000000000005,
      "viseme": "viseme_aa"
    },
    {
      "time": 1.9000000000000006,
      "viseme": "viseme_DD"
    },
    {
      "time": 2.0000000000000004,
      "viseme": "viseme_sil"
    },
    {
      "time": 2.1000000000000005,
      "viseme": "viseme_rr"
    },
    {
      "time": 2.2000000000000006,
      "viseme": "viseme_aa"
    },
    {
      "time": 2.500000000000001,
      "viseme": "viseme_ss"
    },
    {
      "time": 2.600000000000001,
      "viseme": "viseme_sil"
    },
    {
      "time": 2.700000000000001,
      "viseme": "viseme_PP"
    },
    {
      "time": 2.800000000000001,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.1000000000000014,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.2000000000000015,
      "viseme": "viseme_nn"
    },
    {
      "time": 3.3000000000000016,
      "viseme": "viseme_DD"
    },
    {
      "time": 3.5000000000000018,
      "viseme": "viseme_nn"
    },
    {
      "time": 3.600000000000002,
      "viseme": "viseme_sil"
    },
    {
      "time": 3.700000000000002,
      "viseme": "viseme_ss"
    },
    {
      "time": 3.800000000000002,
      "viseme": "viseme_aa"
    },
    {
      "time": 3.900000000000002,
      "viseme": "viseme_sil"
    },
    {
      "time": 4.100000000000001,
      "viseme": "viseme_sil"
    },
    {
      "time": 4.200000000000001,
      "viseme": "viseme_ss"
    },
    {
      "time": 4.4,
      "viseme": "viseme_ff"
    },
    {
      "time": 4.5,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.6,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.699999999999999,
      "viseme": "viseme_nn"
    },
    {
      "time": 4.799999999999999,
      "viseme": "viseme_DD"
    },
    {
      "time": 4.899999999999999,
      "viseme": "viseme_aa"
    },
    {
      "time": 4.999999999999998,
      "viseme": "viseme_rr"
    },
    {
      "time": 5.099999999999998,
      "viseme": "viseme_ss"
    }
  ],
  "duration": 5.299999999999997,
  "text": "Our team includes Otari, Saba, and Lasha as founders."
}

📋 Viseme Breakdown:
   1. Time: 0.00s → Viseme: viseme_aa
   2. Time: 0.10s → Viseme: viseme_aa
   3. Time: 0.20s → Viseme: viseme_rr
   4. Time: 0.40s → Viseme: viseme_DD
   5. Time: 0.50s → Viseme: viseme_aa
   6. Time: 0.60s → Viseme: viseme_sil
   7. Time: 0.70s → Viseme: viseme_PP
   8. Time: 0.90s → Viseme: viseme_aa
   9. Time: 1.00s → Viseme: viseme_nn
  10. Time: 1.10s → Viseme: viseme_kk
  11. Time: 1.20s → Viseme: viseme_nn
  12. Time: 1.30s → Viseme: viseme_aa
  13. Time: 1.40s → Viseme: viseme_DD
  14. Time: 1.50s → Viseme: viseme_aa
  15. Time: 1.60s → Viseme: viseme_ss
  16. Time: 1.80s → Viseme: viseme_aa
  17. Time: 1.90s → Viseme: viseme_DD
  18. Time: 2.00s → Viseme: viseme_sil
  19. Time: 2.10s → Viseme: viseme_rr
  20. Time: 2.20s → Viseme: viseme_aa
  21. Time: 2.50s → Viseme: viseme_ss
  22. Time: 2.60s → Viseme: viseme_sil
  23. Time: 2.70s → Viseme: viseme_PP
  24. Time: 2.80s → Viseme: viseme_sil
  25. Time: 3.10s → Viseme: viseme_sil
  26. Time: 3.20s → Viseme: viseme_nn
  27. Time: 3.30s → Viseme: viseme_DD
  28. Time: 3.50s → Viseme: viseme_nn
  29. Time: 3.60s → Viseme: viseme_sil
  30. Time: 3.70s → Viseme: viseme_ss
  31. Time: 3.80s → Viseme: viseme_aa
  32. Time: 3.90s → Viseme: viseme_sil
  33. Time: 4.10s → Viseme: viseme_sil
  34. Time: 4.20s → Viseme: viseme_ss
  35. Time: 4.40s → Viseme: viseme_ff
  36. Time: 4.50s → Viseme: viseme_aa
  37. Time: 4.60s → Viseme: viseme_aa
  38. Time: 4.70s → Viseme: viseme_nn
  39. Time: 4.80s → Viseme: viseme_DD
  40. Time: 4.90s → Viseme: viseme_aa
  41. Time: 5.00s → Viseme: viseme_rr
  42. Time: 5.10s → Viseme: viseme_ss

📈 Viseme Frequency:
  viseme_DD: 5 times (11.9%)
  viseme_PP: 2 times (4.8%)
  viseme_aa: 12 times (28.6%)
  viseme_ff: 1 times (2.4%)
  viseme_kk: 1 times (2.4%)
  viseme_nn: 5 times (11.9%)
  viseme_rr: 3 times (7.1%)
  viseme_sil: 8 times (19.0%)
  viseme_ss: 5 times (11.9%)

==================================================

🎯 Test Complete!
==================================================
📁 Check generated audio files in the project directory
🔧 Use the JSON structure above to implement lip-sync in your frontend
💡 The viseme data is what drives the 3D character's mouth animation
$ 