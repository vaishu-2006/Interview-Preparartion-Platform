import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import interviewService from '../services/interviewService';
import LoadingScreen from '../components/common/LoadingScreen';
import { VIOLATION_LABELS } from '../hooks/useProctoring';

const PROVIDER_LABELS = {
  groq: 'Groq',
  gemini: 'Google Gemini',
  mistral: 'Mistral AI',
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
};

const ScoreBar = ({ label, value }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="stat-figure text-ink-3">{value}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-card">
      <div className="h-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const InterviewReportPage = () => {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    interviewService
      .getReport(sessionId)
      .then((res) => setData(res))
      .catch(() => setError(true));
  }, [sessionId]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-ink-2">Report not found for this session.</p>
        <Link to="/mock-interview" className="btn-secondary mt-4 inline-flex">Back to Setup</Link>
      </div>
    );
  }

  if (!data) return <LoadingScreen label="Loading your report..." />;

  const { report, turns, proctoring } = data;

  const handleDownload = async () => {
    try {
      await interviewService.downloadReportPdf(sessionId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download report');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/performance" className="text-sm text-ink-3 hover:text-ink-1">&larr; Back to Performance</Link>
          <h1 className="mt-2 text-2xl font-bold text-ink-1">Interview Report</h1>
          <p className="mt-1 text-ink-3">
            {report.jobRole} · {report.interviewType} · {report.difficulty} · {report.durationMinutes} min ·{' '}
            {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button onClick={handleDownload} className="btn-secondary shrink-0 text-sm">
          Download Report (PDF)
        </button>
      </div>

      {proctoring?.autoSubmitted && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          This interview was auto-submitted after reaching {proctoring.violationCount} proctoring warnings.
        </div>
      )}

      <div className="card p-8 text-center">
        <p className="text-sm text-ink-3">Overall Score</p>
        <p className="stat-figure mt-1 text-5xl font-bold text-brand-500">{report.overallScore}%</p>
        {report.generatedByAI ? (
          <p className="mt-2 text-xs text-ink-3">
            Scored by {PROVIDER_LABELS[report.aiProvider] || report.aiProvider} — confidence and eye contact are from real webcam analysis.
          </p>
        ) : (
          <p className="mt-2 text-xs text-ink-3">
            Scored with rule-based heuristics (no AI key configured yet) — confidence and eye contact are from real webcam analysis.
          </p>
        )}
      </div>

      <div className="card grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <ScoreBar label="Technical Accuracy" value={report.technicalAccuracy} />
        <ScoreBar label="Communication" value={report.communication} />
        <ScoreBar label="Confidence" value={report.confidence} />
        <ScoreBar label="Eye Contact" value={report.eyeContact} />
        <ScoreBar label="Behavior" value={report.behavior} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold text-brand-400">Strengths</h2>
          {report.strengths?.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-ink-2">
              {report.strengths.map((s, i) => <li key={i}>&bull; {s}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">
              {proctoring?.autoSubmitted
                ? 'Nothing to highlight — the session was cut short by proctoring warnings before enough answers were recorded.'
                : 'No specific strengths were identified for this session.'}
            </p>
          )}
        </div>
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold text-gold">Areas for Improvement</h2>
          {report.improvements?.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-ink-2">
              {report.improvements.map((s, i) => <li key={i}>&bull; {s}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">No specific areas were flagged for this session.</p>
          )}
        </div>
      </div>

      {report.suggestions?.length > 0 && (
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold text-ink-1">Suggestions</h2>
          <ul className="space-y-1.5 text-sm text-ink-2">
            {report.suggestions.map((s, i) => <li key={i}>&bull; {s}</li>)}
          </ul>
        </div>
      )}

      {proctoring?.violationCount > 0 && (
        <div className="card p-6">
          <h2 className="mb-3 text-sm font-semibold text-danger">
            Proctoring Activity &middot; {proctoring.violationCount} warning{proctoring.violationCount === 1 ? '' : 's'}
          </h2>
          <ul className="space-y-3">
            {proctoring.violations.map((v, i) => (
              <li key={i} className="flex items-start gap-3 border-t border-surface-border pt-3 first:border-t-0 first:pt-0">
                {v.screenshot ? (
                  <img
                    src={v.screenshot}
                    alt="Webcam frame at time of violation"
                    className="h-14 w-20 shrink-0 rounded-md border border-surface-border object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md border border-surface-border bg-surface text-[10px] text-ink-3">
                    No frame
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-ink-1">{VIOLATION_LABELS[v.type] || v.type}</p>
                  <p className="text-xs text-ink-3">
                    {typeof v.questionIndex === 'number' ? `Question ${v.questionIndex + 1} · ` : ''}
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-ink-1">Question-wise Feedback</h2>
        {turns.map((turn) => {
          const qf = report.questionFeedback.find((q) => q.index === turn.index);
          return (
            <div key={turn.index} className="card p-5">
              <p className="font-medium text-ink-1">{turn.index + 1}. {turn.questionText}</p>
              <p className="mt-2 text-sm text-ink-3">
                <span className="font-medium text-ink-2">Your answer: </span>
                {turn.skipped ? <em>Skipped</em> : turn.answerText || <em>No answer recorded</em>}
              </p>
              {qf && (
                <div className="mt-3 flex items-start justify-between gap-4 border-t border-surface-border pt-3">
                  <p className="text-sm text-ink-2">{qf.feedback}</p>
                  <span className="stat-figure shrink-0 text-sm font-semibold text-brand-400">{qf.score}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewReportPage;
