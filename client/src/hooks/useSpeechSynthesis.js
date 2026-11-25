import { useCallback, useEffect, useRef, useState } from 'react';

const isSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// Reads interview questions aloud via the browser's built-in speech synthesis — no external
// TTS service, no API key, works offline. Pairs with InterviewerAvatar's "speaking" animation.
const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = useCallback((text, onEnd) => {
    if (!isSupported() || !text) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      onEnd?.();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { isSupported: isSupported(), speaking, speak, stop };
};

export default useSpeechSynthesis;
