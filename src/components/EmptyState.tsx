import { Mic } from 'lucide-react';

interface EmptyStateProps {
  hasSearch: boolean;
}

export function EmptyState({ hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center mb-4">
        <Mic className="w-7 h-7 text-gray-600" />
      </div>
      {hasSearch ? (
        <>
          <p className="text-gray-400 font-medium">No notes match your search</p>
          <p className="text-sm text-gray-600 mt-1">Try different keywords</p>
        </>
      ) : (
        <>
          <p className="text-gray-400 font-medium">No notes yet</p>
          <p className="text-sm text-gray-600 mt-1">Hit the mic button to record your first note</p>
        </>
      )}
    </div>
  );
}
