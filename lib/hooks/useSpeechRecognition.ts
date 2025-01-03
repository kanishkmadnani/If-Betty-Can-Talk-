import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createOfflineSpeechRecognition } from '../speechRecognition';
import { SPEECH_RECOGNITION_ERRORS } from '../constants/errors';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({ onTranscript, onError }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createOfflineSpeechRecognition> | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((error: string) => {
    onError?.(error);
    toast({
      title: 'Speech Recognition Error',
      description: error,
      variant: 'destructive',
    });
  }, [onError, toast]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const startRecognition = useCallback(() => {
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = createOfflineSpeechRecognition({
          onResult: (text) => {
            if (text.trim()) {
              onTranscript(text.trim());
            }
          },
          onError: handleError,
          onEnd: () => {
            if (!isPaused) {
              setIsListening(false);
            }
          }
        });
      }
      
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      handleError(SPEECH_RECOGNITION_ERRORS.default);
      setIsListening(false);
    }
  }, [onTranscript, handleError, isPaused]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
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