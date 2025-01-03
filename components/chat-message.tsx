import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} animate-slideIn`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${role === 'assistant' ? 'bg-yellow-100' : 'bg-gray-100'}
      `}>
        {role === 'assistant' ? (
          <Bot className="h-4 w-4 text-yellow-600" />
        ) : (
          <User className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div className={`
        flex-1 rounded-lg p-4 transition-all duration-300 ease-in-out
        ${role === 'assistant' 
          ? 'bg-yellow-50 text-gray-800' 
          : 'bg-gray-100 text-gray-800'}
      `}>
        {content}
      </div>
    </div>
  );
}