import { useState, useCallback } from 'react';
import { translateService, Language } from '../lib/translate';

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string, targetLang: string) => {
    setIsTranslating(true);
    setError(null);
    try {
      const result = await translateService.translate(text, targetLang);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateBatch = useCallback(async (texts: string[], targetLang: string) => {
    setIsTranslating(true);
    setError(null);
    try {
      const results = await translateService.translateBatch(texts, targetLang);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch translation failed');
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const getLanguages = useCallback((): Language[] => {
    return translateService.getLanguages();
  }, []);

  return {
    translate,
    translateBatch,
    getLanguages,
    isTranslating,
    error
  };
}