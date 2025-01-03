interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isPaused: boolean;
  onInterimTranscriptChange: (transcript: string) => void;
}

export function TranscriptDisplay({ 
  transcript, 
  interimTranscript,
  isListening, 
  isPaused,
  onInterimTranscriptChange 
}: TranscriptDisplayProps) {
  const displayText = interimTranscript || transcript;
  
  if (!displayText) return null;

  return (
    <div className="relative z-10">
      <div className="mb-8 text-center transition-all duration-300 ease-in-out transform">
        <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100">
          <p className="text-2xl font-bold text-gray-800 animate-slideIn">
            {displayText}
          </p>
          {isListening && !isPaused && (
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full ml-2 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}