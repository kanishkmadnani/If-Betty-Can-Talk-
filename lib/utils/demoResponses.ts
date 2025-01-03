export const getDemoResponse = (message: string): string => {
  const responses = {
    default: "This is a demo response. To get real AI responses, please configure your OpenAI API key.",
    greeting: "Hello! I'm running in demo mode. To enable full functionality, please add your OpenAI API key.",
    help: "I can help you with various tasks, but I'm currently in demo mode. Add an API key to unlock full capabilities.",
  };

  if (message.toLowerCase().includes('hello')) return responses.greeting;
  if (message.toLowerCase().includes('help')) return responses.help;
  return responses.default;
};