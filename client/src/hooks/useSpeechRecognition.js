import { useCallback, useEffect, useRef, useState } from 'react';

const getSpeechRecognitionCtor = () => window.SpeechRecognition || window.webkitSpeechRecognition;

const useSpeechRecognition = () => {
  const isSupported = Boolean(getSpeechRecognitionCtor());
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const baseTranscriptRef = useRef('');

  useEffect(() => {
    if (!isSupported) return undefined;

    const Ctor = getSpeechRecognitionCtor();
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += text + ' ';
        else interim += text;
      }
      if (finalChunk) baseTranscriptRef.current += finalChunk;
      setTranscript((baseTranscriptRef.current + interim).trim());
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') return;
      setError(
        event.error === 'not-allowed'
          ? 'Microphone permission denied. You can still type your answer.'
          : `Speech recognition error: ${event.error}`
      );
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [isSupported]);

  const start = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    setError(null);
    baseTranscriptRef.current = transcript ? transcript + ' ' : '';
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start() throws if already started; ignore.
    }
  }, [isSupported, transcript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    baseTranscriptRef.current = '';
    setTranscript('');
  }, []);

  return { isSupported, listening, transcript, setTranscript, error, start, stop, reset };
};

export default useSpeechRecognition;
