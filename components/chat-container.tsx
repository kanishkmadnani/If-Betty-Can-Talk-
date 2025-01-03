'use client';

import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { TranscriptDisplay } from '@/components/transcript-display';
import { ChatControls } from '@/components/chat-controls';
import { StatusIndicator } from '@/components/status-indicator';
import { WaveBackground } from '@/components/wave-background';

interface ChatContainerProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  transcript: string;
  isListening: boolean;
  isPaused: boolean;
  isConversationStarted: boolean;
  onStartConversation: () => void;
  onPauseToggle: () => void;
  onEndConversation: () => void;
}

export function ChatContainer({
  messages,
  transcript,
  isListening,
  isPaused,
  isConversationStarted,
  onStartConversation,
  onPauseToggle,
  onEndConversation,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, transcript, interimTranscript]);

  return (
    <div className="flex flex-col h-screen bg-white relative">
      <WaveBackground isListening={isListening && !isPaused} />
      
      <StatusIndicator isListening={isListening} isPaused={isPaused} />
      
      <div className="flex-1 container mx-auto px-4 py-8 relative">
        <TranscriptDisplay 
          transcript={transcript}
          interimTranscript={interimTranscript}
          isListening={isListening}
          isPaused={isPaused}
          onInterimTranscriptChange={setInterimTranscript}
        />

        <div className="relative z-10">
          <ScrollArea 
            className="h-[calc(100vh-16rem)] pr-4 mt-8"
            ref={scrollRef}
          >
            <div className="space-y-4 pb-20">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
            </div>
          </ScrollArea>
        </div>

        <ChatControls
          isConversationStarted={isConversationStarted}
          isListening={isListening}
          isPaused={isPaused}
          onStartConversation={onStartConversation}
          onPauseToggle={onPauseToggle}
          onEndConversation={onEndConversation}
        />
      </div>
    </div>
  );
}