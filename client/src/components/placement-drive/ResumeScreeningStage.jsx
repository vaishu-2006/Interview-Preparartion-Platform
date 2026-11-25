import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import placementDriveService from '../../services/placementDriveService';

const ResumeScreeningStage = ({ drive, onAdvance }) => {
  const [running, setRunning] = useState(false);
  const [file, setFile] = useState(null);
  const screening = drive.resumeScreening;

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked && picked.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      e.target.value = '';
      return;
    }
    setFile(picked || null);
  };

  const runScreening = async () => {
    setRunning(true);
    try {
      const data = await placementDriveService.runResumeScreening(drive._id, file);
      onAdvance(data.drive);
      setFile(null);
      if (data.drive.resumeScreening.status === 'passed') {
        toast.success('Resume screening passed — moving to the Online Assessment.');
      } else {
        toast.error('Resume needs work before moving on — see the feedback below.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Screening failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-ink-1">Resume Screening</h2>
      <p className="mt-1 text-sm text-ink-3">
        Your resume is scored for completeness and quality — the same bar a recruiter's first pass would apply.
      </p>

      {screening.status === 'pending' && (
        <div className="mt-5 space-y-4">
          <div>
            <label className="label-text">Upload a resume (PDF, optional)</label>
            <p className="mt-0.5 text-xs text-ink-3">
              Leave this empty to screen the resume you already have saved in the Resume Builder.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <label className="btn-secondary cursor-pointer text-sm">
                Choose PDF
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
              {file && (
                <span className="flex items-center gap-2 text-xs text-ink-2">
                  {file.name}
                  <button onClick={() => setFile(null)} className="text-ink-3 hover:text-danger" aria-label="Remove file">
                    &times;
                  </button>
                </span>
              )}
            </div>
          </div>

          <button onClick={runScreening} disabled={running} className="btn-primary">
            {running ? 'Screening...' : file ? 'Screen Uploaded Resume' : 'Run Resume Screening'}
          </button>
        </div>
      )}

      {screening.status !== 'pending' && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-brand-500 stat-figure">{screening.score}%</div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                screening.status === 'passed' ? 'bg-brand-600/15 text-brand-400' : 'bg-danger/10 text-danger'
              }`}
            >
              {screening.status === 'passed' ? 'Passed' : 'Needs Improvement'}
            </span>
            {!screening.generatedByAI && <span className="text-xs text-ink-3">(rule-based scoring, no AI key configured)</span>}
          </div>

          <p className="text-xs text-ink-3">
            {screening.source === 'uploaded' ? `Scored from your uploaded file: ${screening.uploadedFileName}` : 'Scored from your saved Resume Builder resume.'}
          </p>

          {screening.feedback?.length > 0 && (
            <ul className="space-y-1.5 text-sm text-ink-2">
              {screening.feedback.map((f, i) => (
                <li key={i}>&bull; {f}</li>
              ))}
            </ul>
          )}

          {screening.status === 'failed' && (
            <div className="space-y-3">
              <div>
                <label className="btn-secondary cursor-pointer text-sm">
                  {file ? `Selected: ${file.name}` : 'Upload a Different Resume (PDF)'}
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3">
                <Link to="/resume" className="btn-secondary text-sm">
                  Edit Resume
                </Link>
                <button onClick={runScreening} disabled={running} className="btn-primary text-sm">
                  {running ? 'Re-screening...' : 'Re-run Screening'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeScreeningStage;
