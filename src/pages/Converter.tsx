import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RefreshCw, Download, Upload, Save, History, Settings, Wand2, Languages, Mic } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguageDetection } from '../hooks/useLanguageDetection';
import { tonePresets, ToneSettings } from '../lib/languageDetect';

interface Voice {
  name: string;
  lang: string;
}

interface TextSegment {
  text: string;
  voice: string;
  pitch: number;
  rate: number;
  volume: number;
  detectedLanguage?: string;
}

interface SavedConversion {
  id: string;
  name: string;
  segments: TextSegment[];
  createdAt: Date;
}

function Converter() {
  const [segments, setSegments] = useState<TextSegment[]>([{
    text: '',
    voice: '',
    pitch: 1,
    rate: 1,
    volume: 1
  }]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showHistory, setShowHistory] = useState(false);
  const [savedConversions, setSavedConversions] = useState<SavedConversion[]>([]);
  const [conversionName, setConversionName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { translate, translateBatch, getLanguages, isTranslating } = useTranslation();
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [showTranslatePanel, setShowTranslatePanel] = useState(false);
  const [selectedTone, setSelectedTone] = useState<keyof typeof tonePresets>('normal');
  const { detectTextLanguage, isDetecting } = useLanguageDetection();
  const synth = window.speechSynthesis;

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'hi-IN', name: 'Hindi' }
  ];

  const aiPrompts = [
    { name: 'Make Professional', prompt: 'Make the text more professional and formal' },
    { name: 'Simplify', prompt: 'Simplify the text for better understanding' },
    { name: 'Make Friendly', prompt: 'Make the text more friendly and conversational' },
    { name: 'Summarize', prompt: 'Create a concise summary of the text' }
  ];

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices().map(voice => ({
        name: voice.name,
        lang: voice.lang
      }));
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSegments(prev => prev.map(seg => ({
          ...seg,
          voice: availableVoices[0].name
        })));
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Load saved conversions from localStorage
    const saved = localStorage.getItem('savedConversions');
    if (saved) {
      setSavedConversions(JSON.parse(saved));
    }
  }, []);

  const applyToneSettings = (tone: keyof typeof tonePresets) => {
    setSelectedTone(tone);
    const settings = tonePresets[tone];
    setSegments(prev => prev.map(seg => ({
      ...seg,
      ...settings
    })));
  };

  const handleSpeak = async () => {
    if (synth.speaking) {
      synth.cancel();
    }

    setIsPlaying(true);
    for (const segment of segments) {
      if (segment.text.trim() !== '') {
        try {
          // Detect language if not already detected
          if (!segment.detectedLanguage) {
            const detectedLang = await detectTextLanguage(segment.text);
            if (detectedLang) {
              segment.detectedLanguage = detectedLang;
              // Find appropriate voice for detected language
              const matchingVoice = voices.find(v => v.lang.startsWith(detectedLang));
              if (matchingVoice) {
                segment.voice = matchingVoice.name;
              }
            }
          }

          const utterance = new SpeechSynthesisUtterance(segment.text);
          utterance.voice = synth.getVoices().find(voice => voice.name === segment.voice) || null;
          utterance.pitch = segment.pitch;
          utterance.rate = segment.rate;
          utterance.volume = segment.volume;

          await new Promise<void>((resolve, reject) => {
            utterance.onend = () => resolve();
            utterance.onerror = () => reject();
            synth.speak(utterance);
          });
        } catch (error) {
          console.error('Speech synthesis failed:', error);
        }
      }
    }
    setIsPlaying(false);
  };

  const handlePauseResume = () => {
    if (synth.speaking) {
      if (isPaused) {
        synth.resume();
      } else {
        synth.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsPaused(false);
    setIsPlaying(false);
    setCurrentSegment(0);
  };

  const addSegment = () => {
    setSegments(prev => [...prev, {
      text: '',
      voice: voices[0]?.name || '',
      pitch: 1,
      rate: 1,
      volume: 1
    }]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      setSegments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSegment = (index: number, updates: Partial<TextSegment>) => {
    setSegments(prev => prev.map((seg, i) => 
      i === index ? { ...seg, ...updates } : seg
    ));
  };

  const handleExport = () => {
    const text = segments.map(seg => seg.text).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speakeasy-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveConversion = () => {
    if (!conversionName.trim()) return;

    const newConversion: SavedConversion = {
      id: Date.now().toString(),
      name: conversionName,
      segments: [...segments],
      createdAt: new Date()
    };

    const updatedConversions = [...savedConversions, newConversion];
    setSavedConversions(updatedConversions);
    localStorage.setItem('savedConversions', JSON.stringify(updatedConversions));
    setConversionName('');
  };

  const loadConversion = (conversion: SavedConversion) => {
    setSegments(conversion.segments);
    setShowHistory(false);
  };

  const deleteConversion = (id: string) => {
    const updatedConversions = savedConversions.filter(conv => conv.id !== id);
    setSavedConversions(updatedConversions);
    localStorage.setItem('savedConversions', JSON.stringify(updatedConversions));
  };

  const applyAIPrompt = async (prompt: string) => {
    // Simulate AI text transformation (in a real app, this would call an AI API)
    const transformedSegments = segments.map(seg => ({
      ...seg,
      text: `[AI ${prompt}] ${seg.text}` // This is just a simulation
    }));
    setSegments(transformedSegments);
  };

  const handleTranslate = async () => {
    try {
      const textsToTranslate = segments.map(seg => seg.text);
      const translatedTexts = await translateBatch(textsToTranslate, targetLanguage);
      
      setSegments(prev => prev.map((seg, index) => ({
        ...seg,
        text: translatedTexts[index]
      })));
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const filteredVoices = voices.filter(voice => voice.lang.startsWith(selectedLanguage));

  const renderTonePanel = () => (
    <div className="mb-8 p-6 bg-purple-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Voice Tone</h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(tonePresets).map((tone) => (
          <button
            key={tone}
            onClick={() => applyToneSettings(tone as keyof typeof tonePresets)}
            className={`p-3 rounded-lg transition-colors ${
              selectedTone === tone
                ? 'bg-purple-600 text-white'
                : 'bg-white hover:bg-purple-50'
            }`}
          >
            {tone.charAt(0).toUpperCase() + tone.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        
      <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-xl p-8 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Text to Speech Converter</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowTranslatePanel(!showTranslatePanel)}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-2"
              >
                <Languages className="w-5 h-5" />
                Translate
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                History
              </button>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="px-4 py-2 text-purple-400 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                AI Tools
              </button>
            </div>
          </div>

          {/* Translation Panel */}
          {showTranslatePanel && (
            <div className="mb-8 p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">Translate Text</h3>
              <div className="flex items-center gap-4 mb-4">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg flex-1"
                >
                  {getLanguages().map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isTranslating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="w-5 h-5" />
                      Translate
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

         

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-8 p-6 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    Auto-play segments
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Master Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-48 bg-gray-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Tools Panel */}
          {showAIPanel && (
            <div className="mb-8 p-6 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">AI Text Enhancement</h3>
              <div className="grid grid-cols-2 gap-4">
                {aiPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => applyAIPrompt(prompt.prompt)}
                    className="px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    {prompt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <div className="mb-8 p-6 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">Saved Conversions</h3>
              <div className="space-y-4">
                {savedConversions.map((conversion) => (
                  <div
                    key={conversion.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600"
                  >
                    <div>
                      <h4 className="font-medium text-white">{conversion.name}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadConversion(conversion)}
                        className="px-3 py-1 text-purple-400 hover:bg-purple-700 rounded"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteConversion(conversion.id)}
                        className="px-3 py-1 text-red-400 hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-400"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Text Segments */}
          <div className="space-y-6">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={`p-6 border rounded-lg transition-colors ${
                  currentSegment === index && isPlaying
                    ? 'border-purple-500 bg-gray-900'
                    : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-white">Segment {index + 1}</h3>
                  {segments.length > 1 && (
                    <button
                      onClick={() => removeSegment(index)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <textarea
                  value={segment.text}
                  onChange={(e) => updateSegment(index, { text: e.target.value })}
                  className="w-full h-32 p-4 border border-gray-600 bg-gray-800 text-white rounded-lg mb-4 resize-none placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Enter text to convert to speech..."
                />

                {segment.detectedLanguage && (
                  <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-400" />
                    Detected Language: {languages.find(l => l.code === segment.detectedLanguage)?.name || segment.detectedLanguage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Voice
                    </label>
                    <select
                      value={segment.voice}
                      onChange={(e) => updateSegment(index, { voice: e.target.value })}
                      className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      {filteredVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Speed
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={segment.rate}
                      onChange={(e) =>
                        updateSegment(index, { rate: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pitch
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={segment.pitch}
                      onChange={(e) =>
                        updateSegment(index, { pitch: parseFloat(e.target.value) })
                      }
                      className="w-full bg-gray-700 accent-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-4">
              <button
                onClick={handleSpeak}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 transition"
              >
                {isPlaying ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Restart
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play All
                  </>
                )}
              </button>
              {isPlaying && (
                <button
                  onClick={handlePauseResume}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 transition"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 text-purple-400 border border-purple-500 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={addSegment}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 transition"
              >
                <Upload className="w-5 h-5" />
                Add Segment
              </button>
            </div>
          </div>

          {/* Save Conversion */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <div className="flex gap-4">
              <input
                type="text"
                value={conversionName}
                onChange={(e) => setConversionName(e.target.value)}
                placeholder="Enter a name for this conversion"
                className="flex-1 p-2 bg-gray-800 border border-gray-600 text-white rounded-lg placeholder-gray-400"
              />
              <button
                onClick={saveConversion}
                disabled={!conversionName.trim()}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Converter;