import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import interviewService from '../services/interviewService';
import placementDriveService from '../services/placementDriveService';
import useWebcam from '../hooks/useWebcam';
import useFaceTracking from '../hooks/useFaceTracking';
import usePhoneDetection from '../hooks/usePhoneDetection';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import useProctoring from '../hooks/useProctoring';
import LoadingScreen from '../components/common/LoadingScreen';
import CameraPanel from '../components/interview/CameraPanel';
import InterviewerAvatar from '../components/interview/InterviewerAvatar';
import AnswerPanel from '../components/interview/AnswerPanel';
import ViolationBadge from '../components/proctoring/ViolationBadge';

// How long the candidate can go silent after speaking before the AI treats the answer as
// finished and moves on by itself — long enough for a thinking pause, short enough to feel live.
const SILENCE_ADVANCE_MS = 3500;

const LiveInterviewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const driveId = searchParams.get('driveId');
  const videoRef = useRef(null);
  const currentIndexRef = useRef(0);
  const canvasRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const autoAdvancingRef = useRef(false);
  const finishingRef = useRef(false);

  const [session, setSession] = useState(null);
  const [turns, setTurns] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const webcam = useWebcam();
  const faceTracking = useFaceTracking();
  const phoneDetection = usePhoneDetection();
  const speech = useSpeechRecognition();
  const tts = useSpeechSynthesis();
  const proctoringFlagRef = useRef(() => {});

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    interviewService
      .getSession(sessionId)
      .then((data) => {
        setSession(data.session);
        setTurns(data.turns);
        setSecondsLeft(data.session.durationMinutes * 60);
      })
      .catch(() => setLoadError(true));
  }, [sessionId]);

  useEffect(() => {
    // Gated on `session` rather than running on mount: until the session loads, this
    // component renders <LoadingScreen> (no <video> in the tree yet), so videoRef.current
    // would still be null and the stream would never actually attach to the real element.
    if (!session) return undefined;
    let cancelled = false;
    (async () => {
      const stream = await webcam.start(videoRef.current);
      if (stream && !cancelled) {
        faceTracking.start(videoRef.current, (sample) => {
          interviewService.recordMetric(sessionId, { ...sample, questionIndex: currentIndexRef.current }).catch(() => {});
        });
        phoneDetection.start(videoRef.current, () => proctoringFlagRef.current('phone_detected'));
      }
    })();
    return () => {
      cancelled = true;
      webcam.stop();
      faceTracking.stop();
      phoneDetection.stop();
      speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Speaks each question aloud as it becomes current, pairing with InterviewerAvatar's
  // speaking animation — this is the "live AI interviewer" behavior. As soon as the AI
  // finishes speaking, it starts listening on its own so the candidate never has to touch
  // the screen to begin answering.
  useEffect(() => {
    const questionText = turns[currentIndex]?.questionText;
    if (!session || !questionText) return undefined;
    autoAdvancingRef.current = false;
    tts.speak(questionText, () => {
      if (speech.isSupported) speech.start();
    });
    return () => {
      tts.stop();
      speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, turns, currentIndex]);

  useEffect(() => {
    finishingRef.current = finishing;
  }, [finishing]);

  const handleFinish = useCallback(async (autoSubmitted = false, overrideAnswerText) => {
    setFinishing(true);
    try {
      const text = overrideAnswerText !== undefined ? overrideAnswerText : answerText;
      if (!autoSubmitted && text.trim()) {
        await interviewService.answerTurn(sessionId, currentIndex, { answerText: text, answerMode: 'text' });
      }
      await interviewService.completeSession(sessionId, { autoSubmitted });
      webcam.stop();
      faceTracking.stop();
      tts.stop();
      speech.stop();
      toast[autoSubmitted ? 'error' : 'success'](
        autoSubmitted ? 'Interview auto-submitted after repeated proctoring violations' : 'Interview completed'
      );
      if (driveId) {
        // Part of a Placement Drive: sync this stage's score back into the drive and
        // return to it instead of the standalone report page.
        await placementDriveService.syncInterviewStage(driveId);
        navigate(`/placement-drive/${driveId}`, { replace: true });
      } else {
        navigate(`/mock-interview/report/${sessionId}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete interview');
      setFinishing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, currentIndex, answerText, navigate, driveId]);

  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  const goToNext = useCallback(async (mode, overrideAnswerText) => {
    const text = overrideAnswerText !== undefined ? overrideAnswerText : answerText;
    try {
      speech.stop();
      if (mode === 'skip') {
        await interviewService.skipTurn(sessionId, currentIndex);
      } else {
        await interviewService.answerTurn(sessionId, currentIndex, {
          answerText: text,
          answerMode: speech.transcript && speech.transcript.trim() === text.trim() ? 'voice' : 'text',
        });
      }
      speech.reset();
      setAnswerText('');
      setCurrentIndex((i) => i + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save your answer');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, currentIndex, answerText, speech]);

  const goToNextRef = useRef(goToNext);
  useEffect(() => {
    goToNextRef.current = goToNext;
  }, [goToNext]);

  // Silence-based auto-advance: once the candidate has said something and then gone quiet
  // for SILENCE_ADVANCE_MS, treat the answer as complete and move on automatically — no
  // click required. Resets every time new speech (interim or final) comes in.
  useEffect(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (!speech.listening || !speech.transcript.trim()) return undefined;
    silenceTimerRef.current = setTimeout(() => {
      if (autoAdvancingRef.current || finishingRef.current) return;
      autoAdvancingRef.current = true;
      const finalText = speech.transcript;
      speech.stop();
      setAnswerText(finalText);
      if (currentIndexRef.current === turns.length - 1) {
        handleFinishRef.current(false, finalText);
      } else {
        goToNextRef.current('next', finalText);
      }
    }, SILENCE_ADVANCE_MS);
    return () => clearTimeout(silenceTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript, speech.listening, turns.length]);

  // Captures a small downsized JPEG frame from the live webcam feed as violation evidence.
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || webcam.status !== 'active') return undefined;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    const targetWidth = 240;
    const scale = video.videoWidth ? targetWidth / video.videoWidth : 1;
    canvas.width = targetWidth;
    canvas.height = Math.round((video.videoHeight || 180) * scale);
    try {
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.5);
    } catch {
      return undefined;
    }
  }, [webcam.status]);

  const reportViolation = useCallback(
    ({ type, questionIndex, evidence }) =>
      interviewService.recordViolation(sessionId, { type, questionIndex, screenshot: evidence }),
    [sessionId]
  );

  const proctoring = useProctoring({
    enabled: Boolean(session) && !finishing,
    currentIndexRef,
    onViolation: reportViolation,
    onAutoSubmit: () => handleFinishRef.current(true),
    captureEvidence: captureFrame,
  });

  useEffect(() => {
    proctoringFlagRef.current = proctoring.flag;
  }, [proctoring.flag]);

  useEffect(() => {
    if (proctoring.violationCount === 0) return;
    const label = proctoring.labels[proctoring.lastViolation] || 'A proctoring rule was broken';
    if (proctoring.violationCount >= proctoring.maxViolations) {
      toast.error(`${label} — final warning reached, submitting interview.`);
    } else {
      toast.error(`${label} — flagged (${proctoring.violationCount}/${proctoring.maxViolations} warnings).`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proctoring.violationCount]);

  const isPaused = webcam.status === 'denied';

  useEffect(() => {
    if (secondsLeft === null || finishing || isPaused) return undefined;
    if (secondsLeft <= 0) {
      handleFinish();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, finishing, isPaused, handleFinish]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-ink-2">This interview session could not be loaded.</p>
        <button onClick={() => navigate('/mock-interview')} className="btn-secondary mt-4">Back to Setup</button>
      </div>
    );
  }

  if (!session) return <LoadingScreen label="Preparing your interview..." />;

  const isLast = currentIndex === turns.length - 1;
  const currentTurn = turns[currentIndex];

  const minutes = Math.floor(Math.max(0, secondsLeft) / 60);
  const seconds = Math.max(0, secondsLeft) % 60;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-1">{session.jobRole} · {session.interviewType} Interview</h1>
          <p className="text-sm text-ink-3">Question {currentIndex + 1} of {turns.length} · {session.difficulty}</p>
          <p className="mt-0.5 text-xs text-ink-3">
            Proctored session — tab switches, copy/paste, right-click, devtools shortcuts, and a mobile phone in frame
            are flagged; {proctoring.maxViolations} warnings auto-submits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViolationBadge count={proctoring.violationCount} max={proctoring.maxViolations} />
          <span className={`stat-figure text-lg font-semibold ${secondsLeft < 60 ? 'text-danger' : 'text-ink-1'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <button onClick={() => handleFinish()} disabled={finishing} className="btn-secondary border-danger/40 text-danger text-sm">
            {finishing ? 'Ending...' : 'End Interview'}
          </button>
        </div>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-card">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${((currentIndex + 1) / turns.length) * 100}%` }} />
      </div>

      {isPaused && (
        <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          Interview paused — camera access is required to continue. Grant camera access in the panel on the right to resume.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className={`space-y-4 ${isPaused ? 'pointer-events-none opacity-50' : ''}`}>
          <div className="card p-6">
            <span className="mb-2 inline-block rounded bg-surface px-2 py-0.5 text-[11px] text-ink-3">
              {currentTurn?.questionCategory}
            </span>
            <p className="text-lg font-medium text-ink-1">{currentTurn?.questionText}</p>
            {speech.isSupported && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-3">
                {tts.speaking ? (
                  'AI is asking the question...'
                ) : speech.listening ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                    Listening — I&apos;ll move to the next question once you go quiet.
                  </>
                ) : (
                  'Answer by voice or text, then wait or click Next.'
                )}
              </p>
            )}
          </div>

          <AnswerPanel speech={speech} answerText={answerText} setAnswerText={setAnswerText} />

          <div className="flex items-center justify-between">
            <button onClick={() => goToNext('skip')} className="btn-secondary" disabled={finishing || isPaused}>
              Skip Question
            </button>
            {isLast ? (
              <button onClick={() => handleFinish()} disabled={finishing || isPaused} className="btn-primary">
                {finishing ? 'Finishing...' : 'Finish Interview'}
              </button>
            ) : (
              <button onClick={() => goToNext('next')} disabled={finishing || isPaused} className="btn-primary">
                Next Question
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <InterviewerAvatar speaking={tts.speaking} />
          <CameraPanel
            videoRef={videoRef}
            webcamStatus={webcam.status}
            webcamError={webcam.error}
            micActive={webcam.micActive}
            faceSample={faceTracking.latestSample}
            faceStatus={faceTracking.status}
            onRetryCamera={() => webcam.start(videoRef.current)}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewPage;
