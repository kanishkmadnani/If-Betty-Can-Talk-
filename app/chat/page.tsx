'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatContainer } from '@/components/chat-container';
import { VoiceInput } from '@/components/voice-input';
import { sendChatMessage } from '@/lib/chatService';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const { toast } = useToast();

  const handleTranscript = async (newTranscript: string) => {
    setTranscript(newTranscript);
    
    if (newTranscript && !isPaused) {
      await handleSend(newTranscript);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessage = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, newMessage]);
    setTranscript('');

    try {
      const response = await sendChatMessage(text);
      
      if (response.isDemoMode && !isDemoMode) {
        setIsDemoMode(true);
        toast({
          title: 'Demo Mode',
          description: SYSTEM_MESSAGES.API_KEY_MISSING,
          variant: 'warning',
        });
      }

      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: SYSTEM_MESSAGES.NETWORK_ERROR,
        variant: 'destructive',
      });
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setTranscript('');
    setIsListening(true);
    setIsConversationStarted(true);
    setIsPaused(false);

    if (isDemoMode) {
      setMessages([{
        role: 'system',
        content: SYSTEM_MESSAGES.DEMO_MODE
      }]);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const endConversation = () => {
    setIsListening(false);
    setIsConversationStarted(false);
    setTranscript('');
  };

  return (
    <>
      <VoiceInput
        isListening={isListening}
        isPaused={isPaused}
        onTranscript={handleTranscript}
      />
      
      <ChatContainer
        messages={messages}
        transcript={transcript}
        isListening={isListening}
        isPaused={isPaused}
        isConversationStarted={isConversationStarted}
        isDemoMode={isDemoMode}
        onStartConversation={startNewConversation}
        onPauseToggle={togglePause}
        onEndConversation={endConversation}
      />
    </>
  );
}