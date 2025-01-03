'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setupSpeechRecognition } from '@/lib/speechRecognition';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: 'Error',
          description: 'Failed to recognize speech. Please try again.',
          variant: 'destructive',
        });
      };
    } catch (error) {
      console.error('Failed to setup speech recognition:', error);
      toast({
        title: 'Error',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  return (
    <Button
      variant={isListening ? 'destructive' : 'secondary'}
      size="icon"
      onClick={toggleListening}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}