import { useState } from 'react';
import toast from 'react-hot-toast';
import placementDriveService from '../../services/placementDriveService';

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-surface-border py-2 text-sm last:border-b-0">
    <span className="text-ink-2">{label}</span>
    <span className="stat-figure font-semibold text-ink-1">{value}%</span>
  </div>
);

const FinalEvaluationStage = ({ drive, onAdvance }) => {
  const [running, setRunning] = useState(false);

  const finalize = async () => {
    setRunning(true);
    try {
      const data = await placementDriveService.finalize(drive._id);
      onAdvance(data.drive);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Final evaluation failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-ink-1">Final Evaluation</h2>
      <p className="mt-1 text-sm text-ink-3">
        Your scores across all four stages are combined into one overall score and a final verdict.
      </p>

      <div className="mt-5 rounded-xl border border-surface-border p-4">
        <Row label="Resume Screening" value={drive.resumeScreening.score} />
        <Row label="Online Assessment" value={drive.onlineAssessment.score} />
        <Row label="Technical Interview" value={drive.technicalInterview.overallScore} />
        <Row label="HR Interview" value={drive.hrInterview.overallScore} />
      </div>

      <button onClick={finalize} disabled={running} className="btn-primary mt-5">
        {running ? 'Evaluating...' : 'Run Final Evaluation'}
      </button>
    </div>
  );
};

export default FinalEvaluationStage;
