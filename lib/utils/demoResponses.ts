export const getDemoResponse = (message: string): string => {
  // Convert message to lowercase for easier matching
  const lowercaseMessage = message.toLowerCase();
  
  // Define response patterns
  const responses = {
    greeting: [
      "Hello! I'm working offline but I can still help you.",
      "Hi there! I'm in offline mode but ready to assist.",
      "Greetings! I'm operating offline but fully functional."
    ],
    help: [
      "I can help you with basic tasks while offline. Just speak naturally!",
      "Even in offline mode, I can assist you with various queries.",
      "I'm here to help! Though offline, I can still understand and respond."
    ],
    weather: [
      "I'm offline so I can't check the weather right now.",
      "Weather information requires an internet connection.",
      "Sorry, I need to be online to fetch weather data."
    ],
    time: [
      `The current time is ${new Date().toLocaleTimeString()}`,
      `It's ${new Date().toLocaleTimeString()} right now`,
      `Currently it's ${new Date().toLocaleTimeString()}`
    ],
    default: [
      "I understood what you said, but I'm in offline mode.",
      "I heard you! But since I'm offline, my responses are limited.",
      "I got your message! Though offline, I'm still listening."
    ]
  };

  // Helper function to get random response from array
  const getRandomResponse = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Match message to appropriate response
  if (lowercaseMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return getRandomResponse(responses.greeting);
  }
  if (lowercaseMessage.match(/\b(help|assist|support)\b/)) {
    return getRandomResponse(responses.help);
  }
  if (lowercaseMessage.match(/\b(weather|temperature|forecast)\b/)) {
    return getRandomResponse(responses.weather);
  }
  if (lowercaseMessage.match(/\b(time|clock)\b/)) {
    return getRandomResponse(responses.time);
  }

  return getRandomResponse(responses.default);
};