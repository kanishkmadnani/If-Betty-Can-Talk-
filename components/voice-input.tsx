'use client';

import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';

interface VoiceInputProps {
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  onTranscript: (transcript: string) => void;
  isPaused: boolean;
}

export function VoiceInput({ isListening, setIsListening, onTranscript, isPaused }: VoiceInputProps) {
  const { toggleListening } = useSpeechRecognition({
    onTranscript,
    onError: () => setIsListening(false),
  });

  const handleClick = () => {
    toggleListening();
    setIsListening(!isListening);
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className={`
        rounded-full w-16 h-16 p-0
        ${isListening 
          ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50' 
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50'}
        transition-all duration-300 ease-in-out
        ${isListening ? 'scale-110' : 'scale-100'}
      `}
    >
      <Mic className={`h-6 w-6 ${isListening ? 'animate-pulse' : ''}`} />
    </Button>
  );
}