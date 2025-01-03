import { Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatControlsProps {
  isConversationStarted: boolean;
  isListening: boolean;
  isPaused: boolean;
  onStartConversation: () => void;
  onPauseToggle: () => void;
  onEndConversation: () => void;
}

export function ChatControls({
  isConversationStarted,
  isListening,
  isPaused,
  onStartConversation,
  onPauseToggle,
  onEndConversation,
}: ChatControlsProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
      {!isConversationStarted ? (
        <Button
          size="lg"
          onClick={onStartConversation}
          className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Start Conversation
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="lg"
            onClick={onPauseToggle}
            className={`
              rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105
              ${isPaused 
                ? 'bg-yellow-50 border-yellow-500 hover:bg-yellow-100' 
                : 'bg-white border-yellow-500 hover:bg-gray-50'
              }
            `}
          >
            {isPaused ? (
              <Play className="h-6 w-6 text-yellow-500" />
            ) : (
              <Pause className="h-6 w-6 text-yellow-500" />
            )}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={onEndConversation}
            className="rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <X className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}