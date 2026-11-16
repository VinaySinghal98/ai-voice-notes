import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
  onTranscriptChange: (value: string) => void;
}

export function TranscriptDisplay({
  transcript,
  interimTranscript,
  isRecording,
  onTranscriptChange,
}: TranscriptDisplayProps) {
  const isEmpty = !transcript && !interimTranscript;

  return (
    <div className="relative w-full">
      <div
        className={`
          relative min-h-[180px] rounded-xl border p-4 font-mono text-sm leading-relaxed
          transition-colors duration-200
          ${isRecording
            ? 'border-red-500/40 bg-gray-900/80'
            : 'border-gray-700/60 bg-gray-900/40'
          }
        `}
      >
        {isRecording && (
          <div className="absolute top-3 right-3 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-red-400"
                style={{
                  height: `${12 + Math.random() * 12}px`,
                  animation: `pulse ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        )}

        {isEmpty ? (
          <p className="text-gray-600 select-none">
            {isRecording
              ? 'Listening… start speaking'
              : 'Your transcribed speech will appear here…'}
          </p>
        ) : (
          <>
            {/* Editable final transcript */}
            <textarea
              value={transcript}
              onChange={(e) => onTranscriptChange(e.target.value)}
              className="w-full bg-transparent resize-none outline-none text-gray-100 placeholder-gray-600"
              style={{ minHeight: '120px', height: 'auto' }}
              rows={Math.max(4, (transcript.match(/\n/g) || []).length + 2)}
              placeholder=""
            />
            {/* Interim (live, non-final) text */}
            {interimTranscript && (
              <span className="text-gray-500 italic">{interimTranscript}</span>
            )}
          </>
        )}
      </div>

      {!isEmpty && (
        <p className="mt-1.5 text-xs text-gray-600 text-right">
          {transcript.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      )}
    </div>
  );
}
