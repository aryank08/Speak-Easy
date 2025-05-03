import { useState, useCallback } from 'react';
import { detectLanguage } from '../lib/languageDetect';

export function useLanguageDetection() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const detectTextLanguage = useCallback(async (text: string) => {
    if (!text.trim()) return null;
    
    setIsDetecting(true);
    try {
      const language = await detectLanguage(text);
      setDetectedLanguage(language);
      return language;
    } catch (error) {
      console.error('Language detection failed:', error);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return {
    detectTextLanguage,
    isDetecting,
    detectedLanguage
  };
}