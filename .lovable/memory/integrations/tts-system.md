---
name: ElevenLabs TTS System
description: Text-to-speech via ElevenLabs multilingual v2, replacing Azure TTS
type: feature
---
- Edge function: `supabase/functions/tts/index.ts`
- Model: `eleven_multilingual_v2` (supports Telugu natively)
- Default voice: Sarah (EXAVITQu4vr4xnSDxMaL)
- Max chars: 1000 per request
- Frontend caches audio blobs in memory to avoid duplicate API calls
- Fallback: browser SpeechSynthesis API if ElevenLabs fails
- API key stored as connector secret `ELEVENLABS_API_KEY`
- Old Azure TTS removed completely (functions, secrets, config)
