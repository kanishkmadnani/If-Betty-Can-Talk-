import { useState, useEffect, useRef, useCallback } from 'react';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({ onTranscript, onError }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  const startRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Error',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join(' ');
      onTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      onError?.(event.error);
      stopRecognition();
      setIsListening(false);
    };

    recognitionRef.current.start();
  }, [onTranscript, onError, stopRecognition, toast]);

  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecognition();
      setIsListening(false);
    } else {
      startRecognition();
      setIsListening(true);
    }
  }, [isListening, startRecognition, stopRecognition]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      startRecognition();
    } else {
      stopRecognition();
    }
    setIsPaused(!isPaused);
  }, [isPaused, startRecognition, stopRecognition]);

  return {
    isListening,
    isPaused,
    toggleListening,
    togglePause,
  };
}