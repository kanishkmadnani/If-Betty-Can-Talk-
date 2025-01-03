import { SPEECH_RECOGNITION_ERRORS } from './constants/errors';

interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class OfflineSpeechRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private lastTranscript: string = '';
  private config: SpeechRecognitionConfig;
  private restartTimeout: NodeJS.Timeout | null = null;

  constructor(config: SpeechRecognitionConfig) {
    this.config = {
      continuous: false, // Changed to false for better stability
      interimResults: true,
      lang: 'en-US',
      ...config
    };
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error(SPEECH_RECOGNITION_ERRORS['service-not-allowed']);
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = this.config.continuous ?? false;
    this.recognition.interimResults = this.config.interimResults ?? true;
    this.recognition.lang = this.config.lang ?? 'en-US';
    this.recognition.maxAlternatives = 1;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.lastTranscript = '';
    };

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');

      // Only send final results or significant changes
      if (event.results[0].isFinal || transcript.length > this.lastTranscript.length + 10) {
        this.lastTranscript = transcript;
        this.config.onResult?.(transcript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      const errorMessage = SPEECH_RECOGNITION_ERRORS[event.error as keyof typeof SPEECH_RECOGNITION_ERRORS] 
        || SPEECH_RECOGNITION_ERRORS.default;
      
      this.config.onError?.(errorMessage);
      this.cleanup();
      this.scheduleRestart();
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.scheduleRestart();
      }
      this.config.onEnd?.();
    };
  }

  private scheduleRestart() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }

    this.restartTimeout = setTimeout(() => {
      if (this.isListening) {
        this.start();
      }
    }, 300); // Short delay before restart
  }

  private cleanup() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    this.isListening = false;
    this.lastTranscript = '';
  }

  public start() {
    if (!this.recognition || this.isListening) return;
    
    try {
      // Reset recognition instance for clean start
      this.recognition.abort();
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.config.onError?.(SPEECH_RECOGNITION_ERRORS.default);
      this.cleanup();
    }
  }

  public stop() {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.recognition.stop();
      this.cleanup();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      this.cleanup();
    }
  }

  public isActive() {
    return this.isListening;
  }
}