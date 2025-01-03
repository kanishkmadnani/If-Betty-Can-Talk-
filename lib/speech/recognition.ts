import { SpeechRecognitionConfig } from './types';

class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private recordingTimeout: NodeJS.Timeout | null = null;
  private transcriptBuffer = '';
  private restartDelay = 300;
  private readonly RECORDING_WINDOW = 3000; // Reduced to 3 seconds for better responsiveness

  constructor(private config: SpeechRecognitionConfig) {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false; // Changed to false for better stability
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.config.lang || 'en-US';

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.transcriptBuffer += ' ' + finalTranscript;
        // Send final transcript immediately
        this.config.onResult(this.transcriptBuffer.trim(), false);
        this.transcriptBuffer = '';
      }

      if (interimTranscript) {
        this.config.onResult(interimTranscript, true);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        this.config.onError?.(event.error);
      }
      this.restartRecognition();
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.restartRecognition();
      }
    };
  }

  private async restartRecognition() {
    if (!this.recognition || !this.isListening) return;

    try {
      await new Promise(resolve => setTimeout(resolve, this.restartDelay));
      if (this.isListening) {
        this.recognition.start();
      }
    } catch (error) {
      console.error('Failed to restart recognition:', error);
      this.cleanup();
    }
  }

  public start() {
    if (!this.recognition || this.isListening) return;

    try {
      this.isListening = true;
      this.transcriptBuffer = '';
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.cleanup();
    }
  }

  public stop() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.isListening = false;
      this.recognition.stop();
      this.cleanup();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
      this.cleanup();
    }
  }

  private cleanup() {
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
      this.recordingTimeout = null;
    }
    this.isListening = false;
    this.transcriptBuffer = '';
  }

  public isActive() {
    return this.isListening;
  }
}

export const createSpeechRecognition = (config: SpeechRecognitionConfig) => {
  return new SpeechRecognitionManager(config);
};