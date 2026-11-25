import { useCallback, useRef, useState } from 'react';

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite';

const SCORE_THRESHOLD = 0.5;
const SAMPLE_INTERVAL_MS = 1500;
const DETECT_COOLDOWN_MS = 8000; // avoid re-flagging every sample while the same phone stays in frame

// Reuses the object-detection task from the same MediaPipe package already loaded for face
// tracking (EfficientDet-Lite0, COCO classes) to flag a phone visible in the webcam feed.
const usePhoneDetection = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const detectorRef = useRef(null);
  const rafRef = useRef(null);
  const lastSampleAtRef = useRef(0);
  const lastFlagAtRef = useRef(0);
  const onDetectedRef = useRef(null);

  const loop = useCallback(() => {
    const video = detectorRef.current?.video;
    const detector = detectorRef.current?.detector;
    if (!video || !detector) return;

    const now = Date.now();
    if (video.readyState >= 2 && now - lastSampleAtRef.current > SAMPLE_INTERVAL_MS) {
      lastSampleAtRef.current = now;
      const result = detector.detectForVideo(video, performance.now());
      const phoneSeen = (result.detections || []).some((d) =>
        (d.categories || []).some((c) => c.score >= SCORE_THRESHOLD && c.categoryName?.toLowerCase().includes('phone'))
      );
      if (phoneSeen && now - lastFlagAtRef.current > DETECT_COOLDOWN_MS) {
        lastFlagAtRef.current = now;
        onDetectedRef.current?.();
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(
    async (videoEl, onDetected) => {
      try {
        setStatus('loading');
        onDetectedRef.current = onDetected;

        const withTimeout = (promise, ms) =>
          Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('MediaPipe init timed out')), ms)),
          ]);

        const { ObjectDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const filesetResolver = await withTimeout(FilesetResolver.forVisionTasks(WASM_URL), 12000);
        const detector = await withTimeout(
          ObjectDetector.createFromOptions(filesetResolver, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
            scoreThreshold: SCORE_THRESHOLD,
            maxResults: 5,
            runningMode: 'VIDEO',
          }),
          12000
        );

        detectorRef.current = { detector, video: videoEl };
        setStatus('ready');
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        console.error('Phone detection initialization failed:', err);
        setStatus('error');
      }
    },
    [loop]
  );

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    detectorRef.current?.detector?.close?.();
    detectorRef.current = null;
    setStatus('idle');
  }, []);

  return { status, start, stop };
};

export default usePhoneDetection;
