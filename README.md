# AI Voice Notes

A real-time speech-to-text note-taking app built with React, TypeScript, and the Web Speech API. Notes are stored locally — no backend, no API keys, no data leaves your browser.

**Live demo →** [voice-notes.vinaybuilds.in](https://voice-notes.vinaybuilds.in)

---

## Features

- **Real-time transcription** — speech is converted to text as you speak, with live interim results shown while a sentence is being recognized
- **Auto-pause handling** — recognition restarts automatically after browser-imposed silence gaps, so long dictations don't cut off
- **Inline editing** — click any saved note to correct the transcript before saving
- **Auto-tagging** — high-frequency keywords in your note are extracted as tags for fast filtering
- **Full-text search** — search across note titles, content, and tags
- **Persistent storage** — all notes survive page refresh via `localStorage`
- **Keyboard accessible** — all interactive elements are reachable by keyboard

---

## Tech

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Strict typing catches issues at compile time; concurrent features for smooth interim-text updates |
| Speech | Web Speech API (`SpeechRecognition`) | Zero-latency browser-native transcription, no API cost |
| Styling | Tailwind CSS | Utility-first keeps component CSS co-located; dark-mode by default |
| Bundler | Vite | Sub-second HMR |
| Icons | Lucide React | Tree-shakeable SVG icon set |

---

## Architecture highlights

`useSpeechRecognition` **hook** — wraps the browser `SpeechRecognition` API into a clean React interface. Handles the continuous/interim result split, auto-restart on silence (browsers stop recognition after ~5 s of silence), and cleanup on unmount to avoid memory leaks.

**Transcript is editable before saving** — mirrors a real dictation workflow where the user corrects recognition errors before committing.

**No server, no auth** — the app works fully offline after the initial page load. This is intentional: sensitive meeting notes or personal memos never leave the device.

---

## Getting started

```bash
npm install
npm run dev
```

Requires a Chromium-based browser (Chrome, Edge, Arc) or Safari 14.1+ for Web Speech API support. Firefox does not support this API.

---

## Potential extensions

- **Deepgram / AssemblyAI integration** — swap the Web Speech API hook for a WebSocket stream to a hosted STT provider for higher accuracy and language support
- **OpenAI Whisper** — post-recording transcription for offline or server-side use
- **Cloud sync** — replace `localStorage` with Supabase or Firebase
- **Speaker diarization** — label different voices in a recording

---

## Author

**Vinay Singhal** — Senior Frontend Engineer · React · TypeScript · AI integrations  
[LinkedIn](https://linkedin.com/in/vinay-singhals) · [GitHub](https://github.com/VinaySinghal98)
