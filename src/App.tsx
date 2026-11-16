import  { useState, useEffect, useCallback } from 'react';
import { Save, Mic, Github, FileText } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { RecordButton } from './components/RecordButton';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { NoteCard } from './components/NoteCard';
import { SearchBar } from './components/SearchBar';
import { EmptyState } from './components/EmptyState';
import type { Note } from './types';
import {
  generateId,
  extractTitle,
  extractTags,
  countWords,
  loadNotes,
  saveNotes,
} from './utils';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [search, setSearch] = useState('');

  const {
    transcript,
    interimTranscript,
    recordingState,
    isSupported,
    elapsedSeconds,
    start,
    stop,
    reset,
    setTranscript,
  } = useSpeechRecognition();

  // Persist notes on change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleSave = useCallback(() => {
    const content = transcript.trim();
    if (!content) return;

    const note: Note = {
      id: generateId(),
      title: extractTitle(content),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      duration: elapsedSeconds,
      wordCount: countWords(content),
      tags: extractTags(content),
    };

    setNotes((prev) => [note, ...prev]);
    reset();
  }, [transcript, elapsedSeconds, reset]);

  const handleDelete = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleUpdate = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              content,
              title: extractTitle(content),
              wordCount: countWords(content),
              tags: extractTags(content),
              updatedAt: new Date(),
            }
          : n
      )
    );
  }, []);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.includes(search.toLowerCase()))
  );

  const canSave = transcript.trim().length > 0 && recordingState === 'idle';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-100 tracking-tight">Voice Notes</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText className="w-3.5 h-3.5" />
            <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
            <span className="mx-1 text-gray-700">·</span>
            <a
              href="https://github.com/VinaySinghal98/ai-voice-notes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Recorder section */}
        <section className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6 space-y-6">
          <div className="flex items-center justify-center">
            <RecordButton
              recordingState={recordingState}
              elapsedSeconds={elapsedSeconds}
              isSupported={isSupported}
              onStart={start}
              onStop={stop}
            />
          </div>

          {(transcript || interimTranscript || recordingState === 'recording') && (
            <TranscriptDisplay
              transcript={transcript}
              interimTranscript={interimTranscript}
              isRecording={recordingState === 'recording'}
              onTranscriptChange={setTranscript}
            />
          )}

          {canSave && (
            <div className="flex gap-3 animate-fade-in">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save note
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200 text-sm transition-colors"
              >
                Discard
              </button>
            </div>
          )}
        </section>

        {/* Notes list */}
        <section className="space-y-4">
          {notes.length > 0 && (
            <SearchBar value={search} onChange={setSearch} />
          )}

          {filteredNotes.length === 0 ? (
            <EmptyState hasSearch={search.length > 0} />
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
