import { useCallback, useRef, useState } from 'react';

const useWebcam = () => {
  const [status, setStatus] = useState('idle'); // idle | requesting | active | denied | unavailable
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  const start = useCallback(async (videoEl) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unavailable');
      setError('Camera access is not supported in this browser.');
      return null;
    }

    setStatus('requesting');
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoEl) {
        videoEl.srcObject = stream;
        await videoEl.play().catch(() => {});
      }
      setStatus('active');
      return stream;
    } catch (err) {
      const denied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setStatus(denied ? 'denied' : 'unavailable');
      setError(
        denied
          ? 'Camera/microphone permission was denied. The interview is paused — allow access to continue.'
          : 'No camera or microphone was found on this device.'
      );
      return null;
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStatus('idle');
  }, []);

  const micActive = status === 'active' && streamRef.current?.getAudioTracks().some((t) => t.enabled);

  return { status, error, start, stop, micActive };
};

export default useWebcam;
