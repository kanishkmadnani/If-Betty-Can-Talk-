import { SYSTEM_MESSAGES } from './constants/messages';
import { getDemoResponse } from './utils/demoResponses';

interface ChatResponse {
  message: string;
  error?: string;
  isDemoMode?: boolean;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  // Check for API key
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return {
      message: getDemoResponse(message),
      isDemoMode: true
    };
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      message: data.message,
      isDemoMode: false
    };
  } catch (error) {
    console.error('Chat service error:', error);
    return {
      message: getDemoResponse(message),
      error: SYSTEM_MESSAGES.NETWORK_ERROR,
      isDemoMode: true
    };
  }
}