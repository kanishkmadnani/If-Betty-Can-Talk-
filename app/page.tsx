import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Mic, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
            <Bot className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            AI Voice Assistant
          </h1>
          
          <p className="max-w-[600px] text-lg text-gray-600 sm:text-xl">
            Experience the future of conversation with our AI voice assistant. Powered by GPT-4,
            it understands and responds to your voice naturally.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[600px] w-full">
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-white">
              <Mic className="w-6 h-6 mb-2 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Voice Input</h3>
              <p className="text-sm text-gray-600">Natural voice conversations</p>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-white">
              <Bot className="w-6 h-6 mb-2 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">GPT-4 Powered</h3>
              <p className="text-sm text-gray-600">Advanced AI understanding</p>
            </div>
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-white">
              <Sparkles className="w-6 h-6 mb-2 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Smart Responses</h3>
              <p className="text-sm text-gray-600">Intelligent conversations</p>
            </div>
          </div>

          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white">
              Start Conversation
              <Bot className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}