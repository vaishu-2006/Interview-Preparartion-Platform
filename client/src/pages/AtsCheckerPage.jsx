import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import resumeService from '../services/resumeService';
import Icon from '../components/icons/Icon';

const scoreTier = (score) => {
  if (score >= 75) return { label: 'Excellent', className: 'text-brand-500 bg-brand-600/10' };
  if (score >= 50) return { label: 'Needs Improvement', className: 'text-gold bg-gold/10' };
  return { label: 'Weak', className: 'text-danger bg-danger/10' };
};

const AtsCheckerPage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked && picked.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      e.target.value = '';
      return;
    }
    setFile(picked || null);
  };

  const runCheck = async () => {
    setChecking(true);
    setResult(null);
    try {
      const data = await resumeService.atsCheck(file, jobDescription);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'ATS check failed');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">ATS Checker</h1>
        <p className="mt-1 text-ink-3">
          Get an ATS-style score and concrete feedback on your resume — upload a PDF, or check the one you already built.
          Paste a job description to check your match against that specific role.
        </p>
      </div>

      <div className="card p-6">
        <label className="label-text">Upload a resume (PDF, optional)</label>
        <p className="mt-0.5 text-xs text-ink-3">Leave this empty to check the resume you already have saved in the Resume Builder.</p>
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

        <label className="label-text mt-5 block">Job description (optional)</label>
        <p className="mt-0.5 text-xs text-ink-3">Paste the JD you're targeting — the score and suggestions will be matched against it.</p>
        <textarea
          className="input-field mt-2 min-h-[120px] resize-y"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button onClick={runCheck} disabled={checking} className="btn-primary mt-5">
          {checking ? 'Checking...' : file ? 'Check Uploaded Resume' : 'Check My Resume'}
        </button>

        {!file && (
          <p className="mt-3 text-xs text-ink-3">
            No resume yet?{' '}
            <Link to="/resume" className="text-brand-400 hover:underline">
              Build one in the Resume Builder
            </Link>
            .
          </p>
        )}
      </div>

      {result && (
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-brand-500 stat-figure">{result.score}</div>
            <div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreTier(result.score).className}`}>
                {scoreTier(result.score).label}
              </span>
              <p className="mt-1 text-xs text-ink-3">
                {result.source === 'uploaded' ? `From your uploaded file: ${result.uploadedFileName}` : 'From your saved Resume Builder resume'}
              </p>
            </div>
          </div>

          {!result.generatedByAI && (
            <p className="mt-4 text-xs text-ink-3">(Rule-based scoring — no AI key configured on this deployment.)</p>
          )}

          {result.jdMatchPercent !== undefined && (
            <div className="mt-5 rounded-xl border border-surface-border bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink-1">Match against job description</span>
                <span className="stat-figure font-semibold text-brand-500">{result.jdMatchPercent}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-card">
                <div
                  className={`h-full transition-all ${
                    result.jdMatchPercent >= 60 ? 'bg-brand-600' : result.jdMatchPercent >= 35 ? 'bg-gold' : 'bg-danger'
                  }`}
                  style={{ width: `${result.jdMatchPercent}%` }}
                />
              </div>
              {result.missingKeywords?.length > 0 && (
                <>
                  <p className="mt-3 text-xs text-ink-3">Missing from your resume, present in the JD:</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.missingKeywords.map((k) => (
                      <span key={k} className="rounded-full bg-danger/10 px-2.5 py-1 text-xs text-danger">
                        {k}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {result.feedback?.length > 0 && (
            <div className="mt-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-1">
                <Icon name="shieldCheck" className="h-4 w-4 text-brand-500" />
                Improvement Suggestions
              </h3>
              <ul className="mt-2 space-y-2">
                {result.feedback.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                    <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AtsCheckerPage;
