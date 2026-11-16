export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  duration?: number; // seconds
  wordCount: number;
  tags: string[];
}

export type RecordingState = 'idle' | 'recording' | 'paused';

// SpeechRecognition types are declared in src/types/speech.d.ts
