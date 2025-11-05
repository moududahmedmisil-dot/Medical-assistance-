import React from 'react';
import { type ParsedResponse, type GroundingChunk } from '../types';
import { AlertIcon, FirstAidIcon, MapPinIcon, SpeakerOnIcon, SpeakerOffIcon } from './icons';

interface ResponseCardProps {
  response: ParsedResponse;
  groundingChunks: GroundingChunk[];
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

// A helper component to render a section of the response.
const ResponseSection: React.FC<{ title: string; content: string | undefined; icon: React.ReactNode }> = ({ title, content, icon }) => {
  if (!content) return null;

  // Regex to find markdown links and replace them with <a> tags
  const renderContentWithLinks = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (index % 3 === 1) { // This is the link text
        const url = parts[index + 1];
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-500 font-semibold underline"
          >
            {part}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" /><path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 0 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" /></svg>
          </a>
        );
      }
      if (index % 3 === 2) { // This is the URL, already used
        return null;
      }
      return part.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>);
    });
  };

  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-lg font-semibold text-cyan-600 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="text-slate-700 pl-8 space-y-1">
        {renderContentWithLinks(content)}
      </div>
    </div>
  );
};

export const ResponseCard: React.FC<ResponseCardProps> = ({ response, groundingChunks, isSpeaking, onToggleSpeech }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl p-4 md:p-6 w-full animate-fade-in relative shadow-lg shadow-gray-500/10">
      <button
        onClick={onToggleSpeech}
        className="absolute top-3 right-3 p-2 rounded-full bg-gray-200/50 hover:bg-gray-300/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label={isSpeaking ? "Stop reading aloud" : "Read guidance aloud"}
      >
        {isSpeaking
          ? <SpeakerOffIcon className="w-6 h-6 text-red-500" />
          : <SpeakerOnIcon className="w-6 h-6 text-cyan-600" />
        }
      </button>

      {response.emergencyNumbers && (
        <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 mb-6 text-center animate-pulse">
          <p className="font-bold text-lg">{response.emergencyNumbers}</p>
        </div>
      )}
      <div className="pr-12">
        <ResponseSection title="Immediate Action" content={response.immediateAction} icon={<AlertIcon className="w-6 h-6 text-red-500" />} />
        <ResponseSection title="First Aid" content={response.firstAid} icon={<FirstAidIcon className="w-6 h-6 text-green-500" />} />
        <ResponseSection title="Local Help" content={response.localHelp} icon={<MapPinIcon className="w-6 h-6 text-blue-500" />} />

        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-cyan-600 mb-2 flex items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-blue-500" />
              Nearby Hospitals (from Google Maps)
            </h3>
            <div className="pl-8 space-y-2">
              {groundingChunks.map((chunk, index) => (
                <a
                  key={index}
                  href={chunk.maps.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-100/50 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <p className="font-semibold text-slate-800">{chunk.maps.title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};