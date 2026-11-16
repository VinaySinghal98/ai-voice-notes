import { useState, useEffect, useRef, useCallback } from 'react';
import type { RecordingState } from '../types';

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  recordingState: RecordingState;
  isSupported: boolean;
  elapsedSeconds: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  setTranscript: (value: string) => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, [clearTimer]);

  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
        setRecordingState('idle');
        clearTimer();
      }
    };

    recognition.onend = () => {
      // Auto-restart if still recording (browser stops after silence)
      if (recordingState === 'recording') {
        recognition.start();
      }
    };

    return recognition;
  }, [clearTimer, recordingState]);

  const start = useCallback(() => {
    if (!isSupported) return;

    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    recognition.start();
    setRecordingState('recording');
    startTimer();
  }, [isSupported, initRecognition, startTimer]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent auto-restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setInterimTranscript('');
    setRecordingState('idle');
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    stop();
    setTranscript('');
    setInterimTranscript('');
    setElapsedSeconds(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, [clearTimer]);

  return {
    transcript,
    interimTranscript,
    recordingState,
    isSupported,
    elapsedSeconds,
    start,
    stop,
    reset,
    setTranscript,
  };
}
