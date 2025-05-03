export interface Language {
  code: string;
  name: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' }
];

export const translateService = {
  async translate(text: string, targetLang: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      } else {
        throw new Error(data.responseDetails || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed. Please try again.');
    }
  },

  async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
    try {
      const translations = await Promise.all(
        texts.map(text => this.translate(text, targetLang))
      );
      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error('Batch translation failed. Please try again.');
    }
  },

  getLanguages(): Language[] {
    return languages;
  },

  getLanguageName(code: string): string {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  }
};