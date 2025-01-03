interface ChatResponse {
  message: string;
  error?: string;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat service error:', error);
    return {
      message: 'Mock response: The API is not configured yet.',
      error: 'Failed to process request',
    };
  }
}