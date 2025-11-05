import React from 'react';
import { type HistoryEntry } from '../types';
import { TrashIcon, CloseIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectEntry,
  onClearHistory,
  onClose,
  isVisible,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-heading"
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 id="history-heading" className="text-xl font-bold">Interaction History</h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Clear history"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-black transition-colors"
              aria-label="Close history panel"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 h-full flex items-center justify-center">
              <p>No history yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    onClick={() => onSelectEntry(entry)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <p className="font-semibold truncate text-slate-800">{entry.userInput}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};