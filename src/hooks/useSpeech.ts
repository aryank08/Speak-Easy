import { useState, useEffect, useCallback } from 'react';
import { speechService, Voice, TextSegment } from '../lib/speech';

export function useSpeech() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);

  useEffect(() => {
    setVoices(speechService.getVoices());
    speechService.setOnVoicesChanged(() => {
      setVoices(speechService.getVoices());
    });
  }, []);

  const speak = useCallback(async (segments: TextSegment[]) => {
    setIsPlaying(true);
    setCurrentSegment(0);

    try {
      for (let i = 0; i < segments.length; i++) {
        setCurrentSegment(i);
        await speechService.speak(segments[i]);
      }
    } finally {
      setIsPlaying(false);
      setCurrentSegment(0);
    }
  }, []);

  const pause = useCallback(() => {
    speechService.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechService.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSegment(0);
  }, []);

  const getVoicesByLanguage = useCallback((lang: string) => {
    return speechService.getVoicesByLanguage(lang);
  }, []);

  return {
    voices,
    isPlaying,
    isPaused,
    currentSegment,
    speak,
    pause,
    resume,
    stop,
    getVoicesByLanguage
  };
}