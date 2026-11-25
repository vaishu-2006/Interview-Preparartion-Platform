import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import interviewService from '../services/interviewService';
import FormInput from '../components/common/FormInput';
import RulesGate from '../components/proctoring/RulesGate';

const TYPES = ['Technical', 'Behavioral', 'HR'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const INTERVIEW_RULES = [
  'Your webcam and microphone must stay on for the full interview.',
  'Do not switch tabs or windows during the interview.',
  'Do not copy questions or paste answers.',
  'A mobile phone visible in frame will be flagged.',
  '3 warnings auto-submits the interview.',
];

const InterviewConfigPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ jobRole: '', interviewType: 'Technical', difficulty: 'Medium', durationMinutes: 20 });
  const [resumeSource, setResumeSource] = useState('platform');
  const [file, setFile] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.jobRole.trim()) {
      toast.error('Job role is required');
      return;
    }
    setShowRules(true);
  };

  const handleStartInterview = async () => {
    try {
      const formData = new FormData();
      formData.append('jobRole', form.jobRole);
      formData.append('interviewType', form.interviewType);
      formData.append('difficulty', form.difficulty);
      formData.append('durationMinutes', form.durationMinutes);
      formData.append('resumeSource', resumeSource);
      if (resumeSource === 'upload' && file) formData.append('resumeFile', file);

      const configData = await interviewService.createConfig(formData);
      const sessionData = await interviewService.startSession(configData.config._id);
      toast.success('Interview started — allow camera/mic access to begin.');
      navigate(`/mock-interview/session/${sessionData.session._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    }
  };

  if (showRules) {
    return <RulesGate title={`${form.jobRole} · ${form.interviewType} Interview`} rules={INTERVIEW_RULES} requiresWebcam onStart={handleStartInterview} />;
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-ink-1">Mock Interview Setup</h1>
      <p className="mt-1 text-ink-3">Configure your practice interview session.</p>

      <form onSubmit={handleFormSubmit} className="card mt-6 space-y-4 p-6">
        <FormInput id="jobRole" name="jobRole" label="Job Role" placeholder="e.g. Software Engineer" value={form.jobRole} onChange={handleChange} />

        <div>
          <label className="label-text">Interview Type</label>
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, interviewType: t }))}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.interviewType === t ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, difficulty: d }))}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  form.difficulty === d ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Resume</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResumeSource('platform')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                resumeSource === 'platform' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              Use my saved resume
            </button>
            <button
              type="button"
              onClick={() => setResumeSource('upload')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                resumeSource === 'upload' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              Upload a PDF
            </button>
          </div>
          {resumeSource === 'upload' && (
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="input-field mt-2 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-white"
            />
          )}
        </div>

        <FormInput
          id="durationMinutes"
          name="durationMinutes"
          type="number"
          min="5"
          max="60"
          label="Interview Duration (minutes)"
          value={form.durationMinutes}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary w-full">
          Continue
        </button>
      </form>
    </div>
  );
};

export default InterviewConfigPage;
