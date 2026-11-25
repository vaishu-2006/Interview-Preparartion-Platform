import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import placementDriveService from '../../services/placementDriveService';
import aptitudeService from '../../services/aptitudeService';
import codingService from '../../services/codingService';
import AptitudeQuiz from '../aptitude/AptitudeQuiz';
import CodeEditor from '../coding/CodeEditor';
import ConsolePanel from '../coding/ConsolePanel';
import RulesGate from '../proctoring/RulesGate';
import ViolationBadge from '../proctoring/ViolationBadge';
import ProctoringCameraWidget from '../proctoring/ProctoringCameraWidget';
import useProctoring from '../../hooks/useProctoring';

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
];

const ASSESSMENT_RULES = [
  'This is a timed round — 2 aptitude categories followed by 1 coding problem.',
  'Do not switch tabs or windows during the round.',
  'Do not copy questions or paste answers/code.',
  'Right-click and developer tools are disabled during the round.',
  '3 warnings in either section auto-submits it.',
];

const OnlineAssessmentStage = ({ drive, onAdvance }) => {
  const [starting, setStarting] = useState(false);
  const [assignment, setAssignment] = useState(null); // { aptitudeSets, codingProblem }
  const [aptitudeIndex, setAptitudeIndex] = useState(0);
  const [collectedAttemptIds, setCollectedAttemptIds] = useState([]);
  const [submittingAptitude, setSubmittingAptitude] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | rules | aptitude | coding | syncing

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const codeConfidenceSamplesRef = useRef([]);

  const start = async () => {
    setStarting(true);
    try {
      const data = await placementDriveService.startAssessment(drive._id);
      setAssignment({ aptitudeSets: data.aptitudeSets, codingProblem: data.codingProblem });
      setAptitudeIndex(0);
      setCollectedAttemptIds([]);
      setCode(data.codingProblem.starterCode[language] || '');
      setResult(null);
      setPhase('aptitude');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start the assessment');
    } finally {
      setStarting(false);
    }
  };

  const handleAptitudeSubmit = async (answers, timeTakenSeconds) => {
    setSubmittingAptitude(true);
    try {
      const category = assignment.aptitudeSets[aptitudeIndex].category;
      const data = await aptitudeService.submitAttempt({ category, answers, timeTakenSeconds });
      const nextIds = [...collectedAttemptIds, data.attemptId];
      setCollectedAttemptIds(nextIds);
      if (aptitudeIndex + 1 < assignment.aptitudeSets.length) {
        setAptitudeIndex((i) => i + 1);
      } else {
        setPhase('coding');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answers');
    } finally {
      setSubmittingAptitude(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(assignment.codingProblem.starterCode[lang] || '');
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    try {
      const data = await codingService.runCode(assignment.codingProblem.slug, { language, code });
      setResult(data.result);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run code');
    } finally {
      setRunning(false);
    }
  };

  const finishAssessment = async (codingAttemptId) => {
    setPhase('syncing');
    try {
      const data = await placementDriveService.syncAssessment(drive._id, {
        aptitudeAttemptIds: collectedAttemptIds,
        codingAttemptId,
      });
      onAdvance(data.drive);
      setAssignment(null);
      setPhase('idle');
      if (data.drive.onlineAssessment.status === 'passed') {
        toast.success('Assessment passed — moving to the Technical Interview.');
      } else {
        toast.error('Assessment score was below the bar — you can try again with a fresh set.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync assessment results');
      setPhase('coding');
    }
  };

  const handleSubmitCode = async () => {
    setSubmittingCode(true);
    setResult(null);
    try {
      const samples = codeConfidenceSamplesRef.current;
      const confidenceScore = samples.length
        ? Math.round(samples.reduce((sum, s) => sum + s.confidenceScore, 0) / samples.length)
        : null;
      const data = await codingService.submitCode(assignment.codingProblem.slug, { language, code, confidenceScore });
      setResult(data);
      await finishAssessment(data.attemptId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmittingCode(false);
    }
  };

  const codeProctoring = useProctoring({ enabled: phase === 'coding' && !submittingCode, onAutoSubmit: handleSubmitCode });

  // --- Not started yet, or a previous attempt failed the bar ---
  if (phase === 'idle') {
    const previouslyFailed = drive.onlineAssessment.status === 'failed';
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-ink-1">Online Assessment</h2>
        <p className="mt-1 text-sm text-ink-3">
          A timed round combining 2 aptitude categories (10 questions) and 1 coding problem, scored together.
        </p>

        {previouslyFailed && (
          <div className="mt-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            Last attempt scored {drive.onlineAssessment.score}% — below the 40% bar. Try again with a fresh set of questions.
          </div>
        )}

        <button onClick={() => setPhase('rules')} disabled={starting} className="btn-primary mt-5">
          {previouslyFailed ? 'Try Again' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  if (phase === 'rules') {
    return <RulesGate title="Online Assessment" rules={ASSESSMENT_RULES} requiresWebcam onStart={start} />;
  }

  if (phase === 'syncing') {
    return (
      <div className="card p-10 text-center text-ink-2">Scoring your assessment...</div>
    );
  }

  if (phase === 'aptitude' && assignment) {
    const set = assignment.aptitudeSets[aptitudeIndex];
    return (
      <div className="space-y-3">
        <p className="text-center text-xs text-ink-3">
          Aptitude {aptitudeIndex + 1} of {assignment.aptitudeSets.length}
        </p>
        <AptitudeQuiz
          key={set.category}
          category={set.category}
          questions={set.questions}
          onSubmit={handleAptitudeSubmit}
          submitting={submittingAptitude}
        />
      </div>
    );
  }

  if (phase === 'coding' && assignment) {
    const problem = assignment.codingProblem;
    return (
      <div className="space-y-4">
        <ProctoringCameraWidget
          onSample={(sample) => codeConfidenceSamplesRef.current.push(sample)}
          onLookAway={() => codeProctoring.flag('looking_away')}
        />
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-1">{problem.title}</h2>
            <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-500">{problem.difficulty}</span>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-ink-2">{problem.statement}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => handleLanguageChange(l.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  language === l.id ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleRun} disabled={running} className="btn-secondary text-sm">
              {running ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmitCode} disabled={submittingCode} className="btn-primary text-sm">
              {submittingCode ? 'Submitting...' : 'Submit & Finish Assessment'}
            </button>
          </div>
        </div>

        <CodeEditor language={language} value={code} onChange={setCode} />
        <ConsolePanel result={result} />
      </div>
    );
  }

  return null;
};

export default OnlineAssessmentStage;
