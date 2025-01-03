export const SPEECH_RECOGNITION_ERRORS = {
  network: 'Network connection lost. Please check your internet connection.',
  'not-allowed': 'Microphone access was denied. Please allow microphone access to use voice input.',
  'no-speech': 'No speech was detected. Please try speaking again.',
  'audio-capture': 'No microphone was found. Please ensure your microphone is connected.',
  'network-request-failed': 'Failed to connect to speech recognition service. Please try again.',
  'service-not-allowed': 'Speech recognition service is not available. Please try again later.',
  default: 'An error occurred with speech recognition. Please try again.',
} as const;