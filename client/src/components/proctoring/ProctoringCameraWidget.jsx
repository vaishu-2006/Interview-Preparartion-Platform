import { useEffect, useRef } from 'react';
import useWebcam from '../../hooks/useWebcam';
import useFaceTracking from '../../hooks/useFaceTracking';
import { confidenceTier } from '../../utils/confidence';

const LOOK_AWAY_STREAK_THRESHOLD = 3; // consecutive low-eye-contact/no-face samples (~4-5s) before flagging
const LOOK_AWAY_EYE_CONTACT_CUTOFF = 35;

// Small persistent camera/mic feed for proctored tests that don't have a full interview-style
// CameraPanel (Aptitude, Subject Prep, UPSC Mock Test, Coding, Mock Tests, Online Assessment).
// RulesGate only checks permission once before the test starts and releases that probe stream —
// this keeps a real stream visibly live for the whole test, matching what Interview already does.
// Also runs the same MediaPipe face-tracking Interview uses, so these tests get a "looking away"
// proctoring flag and a confidence score for the post-test report, not just a passive video feed.
const ProctoringCameraWidget = ({ onSample, onLookAway }) => {
  const videoRef = useRef(null);
  const webcam = useWebcam();
  const faceTracking = useFaceTracking();
  const lookAwayStreakRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stream = await webcam.start(videoRef.current);
      if (stream && !cancelled) {
        faceTracking.start(videoRef.current, (sample) => {
          onSample?.(sample);
          const isLookingAway = !sample || sample.eyeContactScore < LOOK_AWAY_EYE_CONTACT_CUTOFF;
          if (isLookingAway) {
            lookAwayStreakRef.current += 1;
            if (lookAwayStreakRef.current === LOOK_AWAY_STREAK_THRESHOLD) onLookAway?.();
          } else {
            lookAwayStreakRef.current = 0;
          }
        });
      }
    })();
    return () => {
      cancelled = true;
      webcam.stop();
      faceTracking.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveConfidence = faceTracking.latestSample?.confidenceScore;

  return (
    <div className="fixed bottom-5 right-5 z-40 w-44 overflow-hidden rounded-xl border border-surface-border bg-surface-light shadow-lg sm:w-48">
      <div className="relative aspect-video bg-black">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />

        {webcam.status !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface/95 p-2 text-center">
            {webcam.status === 'requesting' && <p className="text-[10px] text-ink-2">Starting camera...</p>}
            {webcam.status === 'denied' && <p className="text-[10px] text-danger">Camera denied</p>}
            {webcam.status === 'unavailable' && <p className="text-[10px] text-gold">No camera found</p>}
          </div>
        )}

        {webcam.status === 'active' && faceTracking.status === 'no-face' && (
          <div className="absolute inset-x-0 top-0 bg-danger/85 px-2 py-1 text-center text-[10px] font-medium text-white">
            Face not visible
          </div>
        )}

        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
          <span className={`h-1.5 w-1.5 rounded-full ${webcam.micActive ? 'bg-brand-500' : 'bg-danger'}`} />
          Proctored
        </div>
      </div>

      <div className="px-2.5 py-2">
        {liveConfidence !== undefined && liveConfidence !== null ? (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink-3">Confidence</span>
              <span className={`font-semibold ${confidenceTier(liveConfidence).className}`}>
                {liveConfidence}% &middot; {confidenceTier(liveConfidence).label}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-card">
              <div
                className={`h-full transition-all ${
                  liveConfidence >= 70 ? 'bg-brand-600' : liveConfidence >= 45 ? 'bg-gold' : 'bg-danger'
                }`}
                style={{ width: `${liveConfidence}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-[11px] text-ink-3">Analyzing confidence...</p>
        )}
      </div>
    </div>
  );
};

export default ProctoringCameraWidget;
