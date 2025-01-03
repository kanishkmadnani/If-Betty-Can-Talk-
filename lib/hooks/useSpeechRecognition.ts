import { useState, useEffect, useRef, useCallback } from 'react';
import { setupSpeechRecognition } from '@/lib/speechRecognition';
import { SPEECH_RECOGNITION_ERRORS } from '@/lib/constants/errors';
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

  const handleError = useCallback((error: string) => {
    const errorMessage = SPEECH_RECOGNITION_ERRORS[error as keyof typeof SPEECH_RECOGNITION_ERRORS] 
      || SPEECH_RECOGNITION_ERRORS.default;
    
    toast({
      title: 'Speech Recognition Error',
      description: errorMessage,
      variant: 'destructive',
    });

    onError?.(errorMessage);
    setIsListening(false);
  }, [toast, onError]);

  const initializeRecognition = useCallback(() => {
    try {
      recognitionRef.current = setupSpeechRecognition();
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        handleError(event.error);
      };

      // Automatically restart on end if still listening and not paused
      recognitionRef.current.onend = () => {
        if (isListening && !isPaused && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

    } catch (error) {
      handleError('service-not-allowed');
    }
  }, [handleError, isListening, isPaused, onTranscript]);

  useEffect(() => {
    initializeRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [initializeRecognition]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      initializeRecognition();
    }
    setIsListening(prev => !prev);
  }, [initializeRecognition]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening && !isPaused) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening, isPaused]);

  return {
    isListening,
    isPaused,
    toggleListening,
    togglePause,
  };
}