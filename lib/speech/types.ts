export interface SpeechRecognitionConfig {
  onResult: (transcript: string, isInterim: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  lang?: string;
}

export interface SpeechRecognitionState {
  isListening: boolean;
  isPaused: boolean;
}