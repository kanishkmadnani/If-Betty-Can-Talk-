import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createSpeechRecognition } from './recognition';
import { SpeechRecognitionConfig, SpeechRecognitionState } from './types';

export function useSpeechRecognition(config: SpeechRecognitionConfig): SpeechRecognitionState & {
  startListening: () => void;
  stopListening: () => void;
  togglePause: () => void;
} {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isPaused: false,
  });
  
  const recognitionRef = useRef(null);
  const { toast } = useToast();

  const handleError = useCallback((error: string) => {
    config.onError?.(error);
    toast({
      title: 'Recognition Error',
      description: error,
      variant: 'destructive',
    });
  }, [config, toast]);

  useEffect(() => {
    recognitionRef.current = createSpeechRecognition({
      ...config,
      onError: handleError,
    });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [config, handleError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setState(prev => ({ ...prev, isListening: true, isPaused: false }));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => {
      const newPaused = !prev.isPaused;
      if (newPaused) {
        stopListening();
      } else {
        startListening();
      }
      return { ...prev, isPaused: newPaused };
    });
  }, [startListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    togglePause,
  };
}