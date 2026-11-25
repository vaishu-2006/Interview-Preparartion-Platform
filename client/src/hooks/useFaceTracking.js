import { useCallback, useRef, useState } from 'react';

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

const NOSE_TIP_INDEX = 1;
const STABILITY_WINDOW = 20;
const SAMPLE_INTERVAL_MS = 1500;

const blendshapeScore = (categories, names) => {
  const matches = names.map((name) => categories.find((c) => c.categoryName === name)?.score || 0);
  return matches.reduce((a, b) => a + b, 0) / matches.length;
};

// Confidence/eye-contact/expression scoring here is a heuristic approximation built from
// MediaPipe's face-landmark and blendshape output (head stability, smile frequency, gaze
// deviation, brow/frown tension) — not a clinically validated measurement.
const useFaceTracking = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | no-face | error
  const [latestSample, setLatestSample] = useState(null);
  const [error, setError] = useState(null);

  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const noseHistoryRef = useRef([]);
  const lastSampleAtRef = useRef(0);
  const onSampleRef = useRef(null);

  const computeSample = useCallback((result) => {
    if (!result.faceLandmarks?.length) {
      setStatus('no-face');
      return null;
    }
    setStatus('ready');

    const landmarks = result.faceLandmarks[0];
    const blendshapes = result.faceBlendshapes?.[0]?.categories || [];

    const nose = landmarks[NOSE_TIP_INDEX];
    noseHistoryRef.current.push({ x: nose.x, y: nose.y });
    if (noseHistoryRef.current.length > STABILITY_WINDOW) noseHistoryRef.current.shift();

    let headStability = 100;
    if (noseHistoryRef.current.length > 3) {
      const xs = noseHistoryRef.current.map((p) => p.x);
      const ys = noseHistoryRef.current.map((p) => p.y);
      const variance = (arr) => {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
      };
      const totalVariance = variance(xs) + variance(ys);
      // Empirically-tuned scale: typical steady-camera jitter is well under 0.001 combined variance.
      headStability = Math.max(0, Math.min(100, Math.round(100 - totalVariance * 250000)));
    }

    const smileScore = Math.round(blendshapeScore(blendshapes, ['mouthSmileLeft', 'mouthSmileRight']) * 100);
    const browDown = blendshapeScore(blendshapes, ['browDownLeft', 'browDownRight']);
    const frown = blendshapeScore(blendshapes, ['mouthFrownLeft', 'mouthFrownRight']);
    const gazeDeviation = blendshapeScore(blendshapes, [
      'eyeLookOutLeft',
      'eyeLookOutRight',
      'eyeLookInLeft',
      'eyeLookInRight',
      'eyeLookUpLeft',
      'eyeLookUpRight',
      'eyeLookDownLeft',
      'eyeLookDownRight',
    ]);
    const eyeContactScore = Math.max(0, Math.min(100, Math.round(100 - gazeDeviation * 140)));

    const confidenceScore = Math.max(
      0,
      Math.min(100, Math.round(headStability * 0.4 + smileScore * 0.35 + (100 - browDown * 100) * 0.25))
    );

    let expression = 'Neutral';
    if (smileScore > 35) expression = 'Confident';
    else if (browDown > 0.35 || frown > 0.25) expression = 'Confused';
    else if (headStability < 40 && smileScore < 15) expression = 'Nervous';

    return { confidenceScore, eyeContactScore, headStability, smileScore, expression };
  }, []);

  const loop = useCallback(() => {
    const video = landmarkerRef.current?.video;
    const landmarker = landmarkerRef.current?.landmarker;
    if (!video || !landmarker) return;

    if (video.readyState >= 2) {
      const result = landmarker.detectForVideo(video, performance.now());
      const sample = computeSample(result);
      const now = Date.now();
      if (sample && now - lastSampleAtRef.current > SAMPLE_INTERVAL_MS) {
        lastSampleAtRef.current = now;
        setLatestSample(sample);
        onSampleRef.current?.(sample);
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [computeSample]);

  const start = useCallback(
    async (videoEl, onSample) => {
      try {
        setStatus('loading');
        setError(null);
        onSampleRef.current = onSample;

        const withTimeout = (promise, ms) =>
          Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('MediaPipe init timed out')), ms)),
          ]);

        const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const filesetResolver = await withTimeout(FilesetResolver.forVisionTasks(WASM_URL), 12000);
        const landmarker = await withTimeout(
          FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
            outputFaceBlendshapes: true,
            runningMode: 'VIDEO',
            numFaces: 1,
          }),
          12000
        );

        landmarkerRef.current = { landmarker, video: videoEl };
        setStatus('ready');
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        console.error('MediaPipe initialization failed:', err);
        setStatus('error');
        setError('Facial analysis could not start. Continuing without confidence tracking.');
      }
    },
    [loop]
  );

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    landmarkerRef.current?.landmarker?.close?.();
    landmarkerRef.current = null;
    noseHistoryRef.current = [];
    setStatus('idle');
  }, []);

  return { status, latestSample, error, start, stop };
};

export default useFaceTracking;
