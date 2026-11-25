import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import placementDriveService from '../../services/placementDriveService';
import RulesGate from '../proctoring/RulesGate';

const AI_FEATURES = [
  'Live AI Questions',
  'Webcam Monitoring',
  'Voice Analysis',
  'Tab Switch Detection',
  'Auto Submit on Violation',
  'Facial Recognition',
  'Confidence & Emotion Detection',
  'Real-time Feedback',
];

const INTERVIEW_RULES = [
  'Your webcam and microphone must stay on for the full interview.',
  'Do not switch tabs or windows during the interview.',
  'Do not copy questions or paste answers.',
  'A mobile phone visible in frame will be flagged.',
  '3 warnings auto-submits the interview.',
];

// currentStage/stageKey use snake_case ('technical_interview') but the drive's embedded
// subdocuments are camelCase ('technicalInterview') — same mapping used server-side.
const STAGE_FIELD = { technical_interview: 'technicalInterview', hr_interview: 'hrInterview' };

const InterviewStage = ({ drive, stageKey, label, onAdvance }) => {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const stage = drive[STAGE_FIELD[stageKey]];

  const start = async () => {
    setStarting(true);
    try {
      const startFn =
        stageKey === 'technical_interview' ? placementDriveService.startTechnicalInterview : placementDriveService.startHrInterview;
      const data = await startFn(drive._id);
      navigate(`/mock-interview/session/${data.sessionId}?driveId=${drive._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to start the ${label}`);
      setStarting(false);
    }
  };

  if (stage.status === 'completed') {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-ink-1">{label}</h2>
        <p className="mt-1 text-sm text-ink-3">Completed. Moving on to the next stage.</p>
        <div className="mt-4 text-4xl font-bold text-brand-500 stat-figure">{stage.overallScore}%</div>
      </div>
    );
  }

  if (showRules) {
    return <RulesGate title={label} rules={INTERVIEW_RULES} requiresWebcam onStart={start} />;
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-ink-1">{label}</h2>
      <p className="mt-1 text-sm text-ink-3">
        A full live AI interview — webcam, voice, and proctoring included, same as the standalone Mock Interview module.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {AI_FEATURES.map((feature) => (
          <span key={feature} className="rounded-lg bg-surface px-2.5 py-2 text-center text-xs text-ink-2">
            {feature}
          </span>
        ))}
      </div>

      <button onClick={() => setShowRules(true)} disabled={starting} className="btn-primary mt-5">
        {starting ? 'Starting...' : `Start ${label}`}
      </button>
    </div>
  );
};

export default InterviewStage;
