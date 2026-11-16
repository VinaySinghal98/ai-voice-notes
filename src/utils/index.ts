import type { Note } from '../types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function extractTitle(text: string): string {
  const firstSentence = text.trim().split(/[.!?]/)[0];
  if (!firstSentence) return 'Untitled Note';
  return firstSentence.length > 50
    ? firstSentence.slice(0, 47) + '...'
    : firstSentence;
}

export function extractTags(text: string): string[] {
  // Pull common topic words as auto-tags (simple heuristic)
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'is','was','are','were','be','been','i','my','me','we','our','you','your',
    'it','its','this','that','have','has','had','do','does','did','will',
    'would','could','should','may','might','can','just','so','as','from',
  ]);
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.replace(/[^a-z]/g, '');
    if (clean.length > 4 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
}

const STORAGE_KEY = 'ai-voice-notes';

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return parsed.map((n) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    console.error('Failed to save notes to localStorage');
  }
}
