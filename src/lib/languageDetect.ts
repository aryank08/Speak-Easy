export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await fetch('https://ws.detectlanguage.com/0.2/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: text })
    });
    const data = await response.json();
    return data.data.detections[0]?.language || 'en';
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en'; // Default to English if detection fails
  }
};

export interface ToneSettings {
  pitch: number;
  rate: number;
  volume: number;
}

export const tonePresets: Record<string, ToneSettings> = {
  normal: { pitch: 1, rate: 1, volume: 1 },
  professional: { pitch: 0.9, rate: 0.9, volume: 1 },
  friendly: { pitch: 1.1, rate: 1.1, volume: 1 },
  energetic: { pitch: 1.2, rate: 1.2, volume: 1 },
  calm: { pitch: 0.8, rate: 0.8, volume: 0.9 },
  serious: { pitch: 0.9, rate: 0.85, volume: 1 }
};