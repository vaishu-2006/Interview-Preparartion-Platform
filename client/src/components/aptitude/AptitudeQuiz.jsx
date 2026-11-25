import { useEffect, useRef, useState } from 'react';
import useProctoring from '../../hooks/useProctoring';
import ViolationBadge from '../proctoring/ViolationBadge';
import ProctoringCameraWidget from '../proctoring/ProctoringCameraWidget';

const AptitudeQuiz = ({ category, questions, onSubmit, submitting }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(questions.length * 45);
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);
  const currentIndexRef = useRef(0);
  const confidenceSamplesRef = useRef([]);

  useEffect(() => {
    currentIndexRef.current = current;
  }, [current]);

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const timeTakenSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    const payload = questions.map((q) => ({ questionId: q._id, selectedOptionIndex: answers[q._id] ?? -1 }));
    const samples = confidenceSamplesRef.current;
    const confidenceScore = samples.length
      ? Math.round(samples.reduce((sum, s) => sum + s.confidenceScore, 0) / samples.length)
      : null;
    onSubmit(payload, timeTakenSeconds, confidenceScore);
  };

  const proctoring = useProctoring({ enabled: !submitting, currentIndexRef, onAutoSubmit: handleSubmit });

  useEffect(() => {
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const question = questions[current];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-2xl">
      <ProctoringCameraWidget
        onSample={(sample) => confidenceSamplesRef.current.push(sample)}
        onLookAway={() => proctoring.flag('looking_away')}
      />
      <div className="card mb-4 flex items-center justify-between p-4">
        <div className="text-sm text-ink-2">
          {category} · Question <span className="font-mono text-ink-1">{current + 1}</span> / {questions.length}
        </div>
        <div className="flex items-center gap-3">
          <ViolationBadge count={proctoring.violationCount} max={proctoring.maxViolations} />
          <div className={`stat-figure text-lg font-semibold ${secondsLeft < 30 ? 'text-danger' : 'text-ink-1'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-card">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="card p-6">
        <p className="text-base font-medium text-ink-1">{question.question}</p>
        <div className="mt-5 space-y-2.5">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers((prev) => ({ ...prev, [question._id]: idx }))}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                answers[question._id] === idx
                  ? 'border-brand-500 bg-brand-600/10 text-brand-400'
                  : 'border-surface-border text-ink-2 hover:border-brand-500/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs text-ink-3">{answeredCount} / {questions.length} answered</span>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)} className="btn-secondary">Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AptitudeQuiz;
