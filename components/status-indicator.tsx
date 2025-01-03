interface StatusIndicatorProps {
  isListening: boolean;
  isPaused: boolean;
}

export function StatusIndicator({ isListening, isPaused }: StatusIndicatorProps) {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
      <div className={`
        w-2 h-2 rounded-full transition-colors duration-300
        ${isListening 
          ? isPaused 
            ? 'bg-gray-400'
            : 'bg-yellow-500 animate-pulse' 
          : 'bg-gray-300'
        }
      `} />
      <span className="text-xs font-medium text-gray-800 uppercase tracking-wider">
        {isListening ? (isPaused ? 'Paused' : 'Listening') : 'Idle'}
      </span>
    </div>
  );
}