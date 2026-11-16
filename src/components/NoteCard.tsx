import React, { useState } from 'react';
import { Trash2, Clock, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import type { Note } from '../types';
import { formatDate, formatDuration } from '../utils';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

export function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(note.content);

  const handleSave = () => {
    onUpdate(note.id, editValue);
    setEditing(false);
  };

  const preview = note.content.slice(0, 140) + (note.content.length > 140 ? '…' : '');

  return (
    <article className="group relative rounded-xl border border-gray-700/50 bg-gray-900/60 p-4 hover:border-gray-600/70 transition-all duration-200 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium text-gray-100 truncate text-sm">{note.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span>{formatDate(note.createdAt)}</span>
            {note.duration !== undefined && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(note.duration)}
              </span>
            )}
            <span>{note.wordCount} words</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              <Hash className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="mt-3">
        {expanded ? (
          editing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 resize-none outline-none focus:border-indigo-500 font-mono leading-relaxed"
                rows={6}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setEditing(false); setEditValue(note.content); }}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
              className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap cursor-text rounded-lg p-2 -mx-2 hover:bg-gray-800/40 transition-colors"
              title="Click to edit"
            >
              {note.content}
            </div>
          )
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">{preview}</p>
        )}
      </div>

      {/* Expand / collapse */}
      {note.content.length > 140 && (
        <button
          onClick={() => { setExpanded(!expanded); setEditing(false); }}
          className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3 h-3" /> Show less</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> Show more</>
          )}
        </button>
      )}
    </article>
  );
}
