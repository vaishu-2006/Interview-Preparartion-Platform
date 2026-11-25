import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import placementDriveService from '../../services/placementDriveService';

const VERDICT_STYLES = {
  Selected: { text: 'text-brand-500', bg: 'bg-brand-600/10', border: 'border-brand-500/40', label: 'Selected' },
  OnHold: { text: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/40', label: 'On Hold' },
  Rejected: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/40', label: 'Rejected' },
};

const BreakdownBar = ({ label, value, max }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="stat-figure text-ink-3">{value} / {max} pts</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-card">
      <div className="h-full bg-brand-600 transition-all" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  </div>
);

const ResultStage = ({ drive }) => {
  const evaluation = drive.finalEvaluation;
  const style = VERDICT_STYLES[evaluation.verdict] || VERDICT_STYLES.OnHold;

  const handleDownload = async () => {
    try {
      await placementDriveService.downloadReportPdf(drive._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download report');
    }
  };

  return (
    <div className="space-y-6">
      <div className={`card border p-8 text-center ${style.border} ${style.bg}`}>
        <p className="text-sm text-ink-3">Final Verdict</p>
        <p className={`mt-1 text-4xl font-bold ${style.text}`}>{style.label}</p>
        <p className="stat-figure mt-3 text-2xl font-semibold text-ink-1">{evaluation.overallScore}% overall</p>
        <button onClick={handleDownload} className="btn-secondary mt-4 text-sm">
          Download Full Report (PDF)
        </button>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink-1">Score Breakdown</h2>
        <div className="space-y-4">
          <BreakdownBar label="Resume Screening (15%)" value={evaluation.breakdown.resumeWeighted} max={15} />
          <BreakdownBar label="Online Assessment (20%)" value={evaluation.breakdown.assessmentWeighted} max={20} />
          <BreakdownBar label="Technical Interview (35%)" value={evaluation.breakdown.technicalWeighted} max={35} />
          <BreakdownBar label="HR Interview (30%)" value={evaluation.breakdown.hrWeighted} max={30} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-1">Full Reports</h2>
        <div className="flex flex-wrap gap-3">
          {drive.technicalInterview.sessionId && (
            <Link to={`/mock-interview/report/${drive.technicalInterview.sessionId}`} className="btn-secondary text-sm">
              Technical Interview Report
            </Link>
          )}
          {drive.hrInterview.sessionId && (
            <Link to={`/mock-interview/report/${drive.hrInterview.sessionId}`} className="btn-secondary text-sm">
              HR Interview Report
            </Link>
          )}
        </div>
      </div>

      <Link to="/placement-drive" className="btn-primary inline-flex">
        Start a New Drive
      </Link>
    </div>
  );
};

export default ResultStage;
