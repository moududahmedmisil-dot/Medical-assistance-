import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getEmergencyGuidance } from './services/geminiService';
import {
  type Location,
  type ParsedResponse,
  type HistoryEntry,
  type GroundingChunk,
} from './types';
import { ResponseCard } from './components/ResponseCard';
import { HistoryPanel } from './components/HistoryPanel';
import {
  HistoryIcon,
  UserPlusIcon,
  PhoneIcon,
  BellIcon,
  CloseIcon,
  PlusIcon,
  HospitalIcon,
} from './components/icons';

// A utility function to parse the raw markdown response from Gemini.
const parseGeminiResponse = (rawResponse: string): ParsedResponse => {
  const sections: ParsedResponse = {};

  const emergencyNumbersMatch = rawResponse.match(
    /### EMERGENCY NUMBERS\s*\n(.*?)(?=\n### |$)/s
  );
  if (emergencyNumbersMatch) {
    sections.emergencyNumbers = emergencyNumbersMatch[1]
      .trim()
      .replace(/🚨 EMERGENCY NUMBERS \([^)]+\): /, '');
  }

  const immediateActionMatch = rawResponse.match(
    /### IMMEDIATE ACTION\s*\n(.*?)(?=\n### |$)/s
  );
  if (immediateActionMatch) {
    sections.immediateAction = immediateActionMatch[1].trim();
  }

  const firstAidMatch = rawResponse.match(
    /### FIRST AID\s*\n(.*?)(?=\n### |$)/s
  );
  if (firstAidMatch) {
    sections.firstAid = firstAidMatch[1].trim();
  }

  const localHelpMatch = rawResponse.match(
    /### LOCAL HELP\s*\n(.*?)(?=\n### |$)/s
  );
  if (localHelpMatch) {
    sections.localHelp = localHelpMatch[1].trim();
  }

  return sections;
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResponse, setParsedResponse] = useState<ParsedResponse | null>(
    null
  );
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isNumbersModalOpen, setIsNumbersModalOpen] = useState<boolean>(false);


  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load history and emergency contact from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('emergency-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedContact = localStorage.getItem('emergency-contact');
      if (savedContact) {
        setEmergencyContact(savedContact);
      }
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('emergency-history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Get user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
        setError(
          'Could not get your location. Local help suggestions may be less accurate.'
        );
      },
      { enableHighAccuracy: true }
    );
  }, []);
  
  const handleSetEmergencyContact = (number: string) => {
    setEmergencyContact(number);
    localStorage.setItem('emergency-contact', number);
  };

  const handleCallEmergencyContact = () => {
    if (!emergencyContact) {
        alert('Please set an emergency contact number first.');
        setIsContactModalOpen(true);
        return;
    }
    if (window.confirm(`Are you sure you want to call your emergency contact?\n(${emergencyContact})`)) {
        window.location.href = `tel:${emergencyContact}`;
    }
  };

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!rawResponse || !parsedResponse) return;

    // Construct the text to be spoken
    let speechText = '';
    if (parsedResponse.emergencyNumbers) {
      speechText += `Emergency numbers: ${parsedResponse.emergencyNumbers}. `;
    }
    if (parsedResponse.immediateAction) {
      speechText += `Immediate action: ${parsedResponse.immediateAction}. `;
    }
    if (parsedResponse.firstAid) {
      speechText += `First aid: ${parsedResponse.firstAid}. `;
    }
    if (parsedResponse.localHelp) {
      speechText += `For local help: ${parsedResponse.localHelp}. `;
    }

    speechText = speechText.replace(/\[.*?\]\(.*?\)/g, ''); // Remove markdown links

    if (speechText) {
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setIsLoading(true);
      setError(null);
      setParsedResponse(null);
      setRawResponse(null);
      setGroundingChunks([]);
      stopSpeech();

      try {
        const response = await getEmergencyGuidance(query, location);
        const text = response.text;
        const parsed = parseGeminiResponse(text);
        const chunks =
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        setRawResponse(text);
        setParsedResponse(parsed);
        setGroundingChunks(chunks as GroundingChunk[]);

        const newEntry: HistoryEntry = {
          id: new Date().toISOString(),
          userInput: query,
          rawResponse: text,
          timestamp: new Date().toISOString(),
        };
        setHistory((prev) => [newEntry, ...prev]);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    },
    [location, stopSpeech]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(userInput);
  };

  const handlePrefilledQuery = (query: string) => {
    setUserInput(query);
    performSearch(query);
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setUserInput(entry.userInput);
    const parsed = parseGeminiResponse(entry.rawResponse);
    setParsedResponse(parsed);
    setRawResponse(entry.rawResponse);
    setGroundingChunks([]);
    setIsHistoryVisible(false);
    setError(null);
    stopSpeech();
  };
  
  const handleNewChat = () => {
    setUserInput('');
    setIsLoading(false);
    setError(null);
    setParsedResponse(null);
    setRawResponse(null);
    setGroundingChunks([]);
    stopSpeech();
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const prefilledQueries = [
    'My friend is choking',
    'Someone has a deep cut and is bleeding a lot',
    "I think I'm having a heart attack",
    'Child has a high fever and is unresponsive',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 selection:bg-cyan-500/20">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
        <header className="flex items-center justify-between p-4 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg shadow-gray-500/10">
          <div className="text-left">
             <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-fuchsia-600">
              AI Emergency Assistant
            </h1>
            <p className="text-slate-600 text-sm hidden md:block">Your first response guide.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-3 rounded-full bg-gray-200/50 hover:bg-gray-300/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="New Chat"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="p-3 rounded-full bg-gray-200/50 hover:bg-gray-300/80 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              aria-label="Set emergency contact"
            >
              <UserPlusIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsHistoryVisible(true)}
              className="p-3 rounded-full bg-gray-200/50 hover:bg-gray-300/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="View history"
            >
              <HistoryIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="w-full">
          <div className="text-center mb-6">
            <p className="font-bold text-red-800 bg-red-100/60 border border-red-300/50 rounded-lg py-2 px-4">
              This is not a substitute for professional medical advice.
              <br className="md:hidden" /> Always call emergency services in a crisis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
                onClick={handleCallEmergencyContact}
                className="flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
                <PhoneIcon className="w-6 h-6" /> Call Contact
            </button>
             <button
                onClick={() => handlePrefilledQuery('Find nearest hospitals')}
                className="flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
                <HospitalIcon className="w-6 h-6" /> Find Hospitals
            </button>
             <button
                onClick={() => setIsNumbersModalOpen(true)}
                className="flex items-center justify-center gap-3 p-4 bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold rounded-lg transition-colors text-lg shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
                <BellIcon className="w-6 h-6" /> Show Numbers
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe the situation... e.g., 'Someone fell and might have broken their arm.'"
              className="w-full h-28 p-4 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all resize-none text-lg text-slate-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
              disabled={isLoading || !userInput.trim()}
            >
              {isLoading ? 'Getting Guidance...' : 'Get Immediate Guidance'}
            </button>
          </form>

          {!isLoading && !parsedResponse && (
            <div className="text-center text-slate-600">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Or try one of these examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prefilledQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => handlePrefilledQuery(query)}
                    className="p-4 bg-white/60 rounded-lg hover:bg-gray-50/80 transition-colors text-left backdrop-blur-sm border border-gray-200"
                  >
                    <p>{query}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-600">
                Analyzing situation and finding local help...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100/50 border border-red-300 text-red-800 rounded-lg p-4 text-center">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {parsedResponse && rawResponse && (
            <ResponseCard
              response={parsedResponse}
              groundingChunks={groundingChunks}
              isSpeaking={isSpeaking}
              onToggleSpeech={handleToggleSpeech}
            />
          )}
        </main>
      </div>
      <HistoryPanel
        isVisible={isHistoryVisible}
        history={history}
        onSelectEntry={handleSelectHistoryEntry}
        onClearHistory={handleClearHistory}
        onClose={() => setIsHistoryVisible(false)}
      />

      {/* Emergency Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-sm shadow-2xl shadow-black/20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Emergency Contact</h2>
                    <button onClick={() => setIsContactModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>
                <p className="text-slate-600 mb-4">Enter a phone number to call in an emergency. It's saved automatically to this browser.</p>
                <input
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => handleSetEmergencyContact(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-slate-900"
                />
            </div>
        </div>
      )}

      {/* Emergency Numbers Modal */}
      {isNumbersModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-sm shadow-2xl shadow-black/20 text-center">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-600">Emergency Numbers (India)</h2>
                    <button onClick={() => setIsNumbersModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="space-y-3 text-lg text-slate-800">
                    <p><span className="font-bold">Ambulance:</span> 102 / 108</p>
                    <p><span className="font-bold">Police:</span> 100</p>
                    <p><span className="font-bold">Fire:</span> 101</p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;