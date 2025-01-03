'use client';

import { useState } from 'react';
import { Send, Mic, MicOff, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { VoiceInput } from '@/components/voice-input';
import { sendChatMessage } from '@/lib/chatService';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const handleTranscript = (newTranscript: string) => {
    setTranscript(newTranscript);
  };

  const handleSend = async () => {
    if (!transcript.trim()) return;

    const newMessage = { role: 'user' as const, content: transcript };
    setMessages(prev => [...prev, newMessage]);
    setTranscript('');

    try {
      const response = await sendChatMessage(transcript);
      
      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
        return;
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Live Status Indicator */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span className="text-xs font-medium text-white uppercase tracking-wider">
          {isListening ? 'Live' : 'Idle'}
        </span>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Voice Visualization */}
        {isListening && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className={`absolute inset-0 border-4 border-purple-500 rounded-full animate-ping ${isPaused ? 'animation-paused' : ''}`} />
                <div className={`absolute inset-4 border-4 border-blue-500 rounded-full animate-ping animation-delay-150 ${isPaused ? 'animation-paused' : ''}`} />
                <div className={`absolute inset-8 border-4 border-teal-500 rounded-full animate-ping animation-delay-300 ${isPaused ? 'animation-paused' : ''}`} />
              </div>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-8 text-center">
            <p className="text-2xl font-bold text-white bg-black/20 p-6 rounded-2xl backdrop-blur-sm">
              {transcript}
            </p>
          </div>
        )}

        {/* Chat Messages */}
        <ScrollArea className="h-[calc(100vh-16rem)] pr-4 mt-8">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
        </ScrollArea>

        {/* Control Buttons */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <VoiceInput
            isListening={isListening}
            setIsListening={setIsListening}
            onTranscript={handleTranscript}
            isPaused={isPaused}
          />
          
          {isListening && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={togglePause}
                className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-teal-500"
              >
                {isPaused ? <Mic className="h-6 w-6 text-teal-500" /> : <Pause className="h-6 w-6 text-teal-500" />}
              </Button>
              
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setIsListening(false)}
                className="rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}