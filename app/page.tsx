import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Mic, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            AI Voice Assistant
          </h1>
          
          <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
            Experience the future of conversation with our AI voice assistant. Powered by GPT-4,
            it understands and responds to your voice naturally.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[600px] w-full">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Mic className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Voice Input</h3>
              <p className="text-sm text-muted-foreground">Natural voice conversations</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Bot className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">GPT-4 Powered</h3>
              <p className="text-sm text-muted-foreground">Advanced AI understanding</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Sparkles className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Smart Responses</h3>
              <p className="text-sm text-muted-foreground">Intelligent conversations</p>
            </div>
          </div>

          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start Conversation
              <Bot className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}