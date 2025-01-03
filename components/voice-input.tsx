'use client';

import { useEffect } from 'react';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';

interface VoiceInputProps {
  isListening: boolean;
  isPaused: boolean;
  onTranscript: (transcript: string) => void;
}

export function VoiceInput({ isListening, isPaused, onTranscript }: VoiceInputProps) {
  const { toggleListening } = useSpeechRecognition({
    onTranscript,
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  useEffect(() => {
    if (isListening && !isPaused) {
      toggleListening();
    }
  }, [isListening, isPaused]); // Remove toggleListening from dependencies

  return null;
}