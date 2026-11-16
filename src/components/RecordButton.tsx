import { Mic, MicOff, Square } from 'lucide-react';
import type { RecordingState } from '../types';
import { formatDuration } from '../utils';

interface RecordButtonProps {
  recordingState: RecordingState;
  elapsedSeconds: number;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function RecordButton({
  recordingState,
  elapsedSeconds,
  isSupported,
  onStart,
  onStop,
}: RecordButtonProps) {
  const isRecording = recordingState === 'recording';

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
          <MicOff className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Speech recognition is not supported in this browser. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? onStop : onStart}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 focus:outline-none focus-visible:ring-4
          focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
          ${isRecording
            ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-500 animate-pulse-ring'
            : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-500 hover:scale-105 active:scale-95'
          }
        `}
      >
        {isRecording ? (
          <Square className="w-7 h-7 text-white fill-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>

      <div className="h-6 flex items-center">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-mono text-red-400 tabular-nums">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">
            Click to start recording
          </span>
        )}
      </div>
    </div>
  );
}
