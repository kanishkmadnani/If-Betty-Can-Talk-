'use client';

import { useEffect } from 'react';
import { useSpeechRecognition } from '@/lib/speech/useSpeechRecognition';

interface VoiceInputProps {
  isListening: boolean;
  isPaused: boolean;
  onTranscript: (transcript: string) => void;
}

export function VoiceInput({ isListening, isPaused, onTranscript }: VoiceInputProps) {
  const { startListening, stopListening } = useSpeechRecognition({
    onResult: onTranscript,
    onError: (error) => {
      console.error('Speech recognition error:', error);
    },
  });

  useEffect(() => {
    if (isListening && !isPaused) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening, isPaused, startListening, stopListening]);

  return null;
}