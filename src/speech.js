// Guaranteed Multilingual Speech Synthesis & Recognition Engine
// Powered by Local Dedicated /api/tts MP3 Streaming + Native Web Speech API Fallback

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.currentAudio = null;
    this.audioQueue = [];
    this.audioQueueIndex = 0;
    this.onStateChange = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', () => this.loadVoices());
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  getNativeVoice(lang) {
    if (!this.voices || !this.voices.length) this.loadVoices();
    const voices = this.voices || [];

    if (lang === 'ta') {
      const taFemale = voices.find(v => 
        (v.name && (v.name.toLowerCase().includes('pallavi') || v.name.toLowerCase().includes('kavya') || v.name.toLowerCase().includes('female'))) &&
        (v.lang && (v.lang.toLowerCase().startsWith('ta') || v.lang.toLowerCase().includes('tamil')))
      );
      if (taFemale) return taFemale;

      return voices.find(v => 
        (v.lang && (v.lang.toLowerCase().startsWith('ta') || v.lang.toLowerCase().includes('tamil'))) ||
        (v.name && (v.name.toLowerCase().includes('tamil') || v.name.toLowerCase().includes('valluvar')))
      ) || null;
    }

    if (lang === 'hi') {
      const hiFemale = voices.find(v => 
        (v.name && (v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('ananya'))) &&
        (v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hindi')))
      );
      if (hiFemale) return hiFemale;

      return voices.find(v => 
        (v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hindi'))) ||
        (v.name && (v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant')))
      ) || null;
    }

    const enFemale = voices.find(v => 
      v.name && (
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('female')
      )
    );
    if (enFemale) return enFemale;

    return voices.find(v => v.lang && (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase().startsWith('en'))) || voices[0] || null;
  }

  cleanTextForSpeech(text, lang = 'en') {
    if (!text) return '';
    let cleaned = text
      .replace(/[🚨⚠️🌡️🗣️🤢🤰🧠🩺🩸👨‍⚕️🌿🚀🔊🔇✨💡📋✓✕●•*#_~`>\[\]\(\)]/gu, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Replace technical acronyms with natural spoken Tamil
    if (lang === 'ta' || /[\u0B80-\u0BFF]/.test(cleaned)) {
      cleaned = cleaned
        .replace(/\bAI\b/gi, 'செயற்கை நுண்ணறிவு')
        .replace(/\bA\.I\b/gi, 'செயற்கை நுண்ணறிவு')
        .replace(/\bBP\b/gi, 'இரத்த அழுத்தம்')
        .replace(/\bORS\b/gi, 'ஓ ஆர் எஸ்')
        .replace(/\bPHC\b/gi, 'ஆரம்ப சுகாதார நிலையம்')
        .replace(/\bASV\b/gi, 'விஷமுறிவு மருந்து')
        .replace(/\bTB\b/gi, 'காசநோய்')
        .replace(/\bSpO2\b/gi, 'ஆக்சிஜன் அளவு')
        .replace(/\bIV\b/gi, 'குளுக்கோஸ்')
        .replace(/\bECG\b/gi, 'இதய பரிசோதனை')
        .replace(/\bX-Ray\b/gi, 'எக்ஸ்ரே')
        .replace(/108/g, 'நூற்றி எட்டு')
        .replace(/104/g, 'நூற்றி நான்கு')
        .replace(/102°F/g, 'நூற்றி இரண்டு டிகிரி')
        .replace(/100°F/g, 'நூறு டிகிரி')
        .replace(/48/g, 'நாற்பத்தெட்டு')
        .replace(/24\/7/g, 'இருபத்தி நான்கு மணி நேரமும்');
    }

    // Replace technical acronyms with natural spoken Hindi
    if (lang === 'hi' || /[\u0900-\u097F]/.test(cleaned)) {
      cleaned = cleaned
        .replace(/\bAI\b/gi, 'एआई')
        .replace(/\bA\.I\b/gi, 'एआई')
        .replace(/\bBP\b/gi, 'ब्लड प्रेशर')
        .replace(/\bORS\b/gi, 'ओआरएस')
        .replace(/\bPHC\b/gi, 'प्राथमिक स्वास्थ्य केंद्र')
        .replace(/\bASV\b/gi, 'एंटी-स्नेक वेनम')
        .replace(/\bTB\b/gi, 'टीबी')
        .replace(/\bSpO2\b/gi, 'ऑक्सीजन स्तर')
        .replace(/\bIV\b/gi, 'ग्लूकोज')
        .replace(/\bECG\b/gi, 'ईसीजी')
        .replace(/\bX-Ray\b/gi, 'एक्स-रे')
        .replace(/108/g, 'एक सौ आठ')
        .replace(/104/g, 'एक सौ चार')
        .replace(/102°F/g, 'एक सौ दो डिग्री')
        .replace(/100°F/g, 'एक सौ डिग्री')
        .replace(/48/g, 'अड़तालीस')
        .replace(/24\/7/g, 'चौबीसों घंटे');
    }

    return cleaned;
  }

  splitIntoChunks(text, maxLen = 80) {
    if (!text) return [];
    const sentences = text.split(/(?<=[.?!;:\n])\s+/);
    const chunks = [];
    let current = '';

    for (const s of sentences) {
      if (!s.trim()) continue;
      if ((current + ' ' + s).trim().length <= maxLen) {
        current = (current + ' ' + s).trim();
      } else {
        if (current) chunks.push(current);
        if (s.length > maxLen) {
          const parts = s.split(/(?<=[,])\s+/);
          for (const p of parts) {
            if (p.trim()) chunks.push(p.trim());
          }
          current = '';
        } else {
          current = s;
        }
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks.length > 0 ? chunks : [text];
  }

  speak(text, lang = 'en', onEndCallback = null) {
    this.stop();

    const clean = this.cleanTextForSpeech(text, lang);
    if (!clean) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    const isTamil = /[\u0B80-\u0BFF]/.test(clean) || lang === 'ta';
    const isHindi = /[\u0900-\u097F]/.test(clean) || lang === 'hi';
    const targetLang = isTamil ? 'ta' : isHindi ? 'hi' : 'en';

    this.isSpeaking = true;
    if (this.onStateChange) this.onStateChange(true);

    const onFinish = () => {
      this.isSpeaking = false;
      this.currentAudio = null;
      if (this.onStateChange) this.onStateChange(false);
      if (onEndCallback) onEndCallback();
    };

    // Primary Engine: High Quality Local /api/tts Endpoint (Same-Origin MP3 Stream)
    return this.playTtsStream(clean, targetLang, onFinish);
  }

  playTtsStream(text, langCode, onFinish) {
    const chunks = this.splitIntoChunks(text, 80);
    if (!chunks.length) {
      onFinish();
      return false;
    }

    this.audioQueue = chunks;
    this.audioQueueIndex = 0;

    const playNext = () => {
      if (!this.isSpeaking || this.audioQueueIndex >= this.audioQueue.length) {
        onFinish();
        return;
      }

      const chunk = this.audioQueue[this.audioQueueIndex++];
      const streamUrl = `/api/tts?tl=${encodeURIComponent(langCode)}&q=${encodeURIComponent(chunk)}`;

      const audio = new Audio(streamUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        playNext();
      };

      audio.onerror = (e) => {
        console.warn("TTS Audio Stream chunk error:", e);
        if (this.audioQueueIndex < this.audioQueue.length) {
          playNext();
        } else {
          this.fallbackNativeSpeech(text, langCode, onFinish);
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Audio play failed or blocked by browser policy:", err);
          this.fallbackNativeSpeech(text, langCode, onFinish);
        });
      }
    };

    playNext();
    return true;
  }

  fallbackNativeSpeech(text, langCode, onFinish) {
    if (!this.synth) {
      onFinish();
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();

      const langKey = langCode === 'ta' ? 'ta' : langCode === 'hi' ? 'hi' : 'en';
      const voice = this.getNativeVoice(langKey);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = langCode === 'ta' ? 'ta-IN' : langCode === 'hi' ? 'hi-IN' : 'en-IN';
      if (voice) utterance.voice = voice;
      utterance.rate = 0.90;
      utterance.pitch = 1.15;

      utterance.onend = () => {
        onFinish();
      };

      utterance.onerror = () => {
        onFinish();
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Fallback speech failed:", e);
      onFinish();
    }
  }

  stop() {
    this.isSpeaking = false;
    this.audioQueue = [];
    this.audioQueueIndex = 0;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    if (this.onStateChange) this.onStateChange(false);
  }

  toggle(text, lang = 'en', btnElement = null) {
    if (this.isSpeaking) {
      this.stop();
      if (btnElement) btnElement.classList.remove('speaking');
      return false;
    } else {
      if (btnElement) btnElement.classList.add('speaking');
      this.speak(text, lang, () => {
        if (btnElement) btnElement.classList.remove('speaking');
      });
      return true;
    }
  }
}

// Web Speech Recognition (Speech-to-Text / Microphone)
class SpeechRecognitionService {
  constructor() {
    const SpeechRec = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
      : null;
    this.recognitionClass = SpeechRec;
    this.recognition = null;
    this.isListening = false;
    this.onStateChange = null;
  }

  isSupported() {
    return !!this.recognitionClass;
  }

  startListening({ lang = 'ta', onResult, onInterim, onError, onEnd }) {
    if (!this.recognitionClass) {
      if (onError) onError(new Error("Speech recognition is not supported in this browser."));
      return false;
    }

    this.stopListening();

    try {
      this.recognition = new this.recognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateChange) this.onStateChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && onInterim) {
          onInterim(interimTranscript);
        }
        if (finalTranscript && onResult) {
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        if (this.onStateChange) this.onStateChange(false);
        if (onError) onError(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStateChange) this.onStateChange(false);
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      this.isListening = false;
      if (onError) onError(err);
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
    this.isListening = false;
    if (this.onStateChange) this.onStateChange(false);
  }
}

export const speechService = new SpeechService();
export const speechRecognitionService = new SpeechRecognitionService();
