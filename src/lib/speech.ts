export interface Voice {
  name: string;
  lang: string;
}

export interface TextSegment {
  text: string;
  voice: string;
  pitch: number;
  rate: number;
  volume: number;
}

class SpeechService {
  private synth: SpeechSynthesis;
  private voices: Voice[] = [];
  private onVoicesChanged?: () => void;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.loadVoices();
        this.onVoicesChanged?.();
      };
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang
    }));
  }

  setOnVoicesChanged(callback: () => void) {
    this.onVoicesChanged = callback;
  }

  getVoices(): Voice[] {
    return this.voices;
  }

  getVoicesByLanguage(lang: string): Voice[] {
    return this.voices.filter(voice => voice.lang.startsWith(lang));
  }

  speak(segment: TextSegment): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.voice = this.synth.getVoices().find(v => v.name === segment.voice) || null;
      utterance.pitch = segment.pitch;
      utterance.rate = segment.rate;
      utterance.volume = segment.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synth.speak(utterance);
    });
  }

  async speakAll(segments: TextSegment[]): Promise<void> {
    for (const segment of segments) {
      await this.speak(segment);
    }
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  stop() {
    this.synth.cancel();
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  isPaused(): boolean {
    return this.synth.paused;
  }
}

export const speechService = new SpeechService();