import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'}
      `}>
        {role === 'assistant' ? (
          <Bot className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
      <div className={`
        flex-1 rounded-lg p-4
        ${role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'}
      `}>
        {content}
      </div>
    </div>
  );
}