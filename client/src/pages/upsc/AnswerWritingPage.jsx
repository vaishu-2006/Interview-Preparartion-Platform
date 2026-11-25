import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import upscService from '../../services/upscService';
import Icon from '../../components/icons/Icon';

const SAMPLE_PROMPTS = [
  'Discuss the significance of the Directive Principles of State Policy in shaping socio-economic legislation in India.',
  'Examine the impact of climate change on Indian agriculture and suggest adaptive measures.',
  'Critically analyze the role of the Finance Commission in Centre-State fiscal relations.',
  'Discuss the challenges and opportunities in India\'s transition to renewable energy.',
  'Evaluate the effectiveness of India\'s disaster management framework in the context of recent natural calamities.',
];

const AnswerWritingPage = () => {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = () => upscService.getAnswerWritingHistory().then((data) => setHistory(data.attempts));

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      toast.error('Write an answer before submitting');
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const data = await upscService.submitAnswerWriting({ prompt, answerText });
      setResult(data.attempt);
      setAnswerText('');
      loadHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Answer Writing Practice</h1>
        <p className="mt-1 text-ink-3">Write a Mains-style answer and get AI feedback on structure, relevance, and content.</p>
      </div>

      <div className="card p-6">
        <label className="label-text">Question</label>
        <select value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input-field">
          {SAMPLE_PROMPTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <label className="label-text mt-4">Your Answer</label>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={12}
          className="input-field resize-y"
          placeholder="Write your answer here — aim for a clear structure with an introduction, body, and conclusion."
        />
        <p className="mt-1 text-xs text-ink-3">{answerText.trim().split(/\s+/).filter(Boolean).length} words</p>

        <button onClick={handleSubmit} disabled={submitting} className="btn-primary mt-4">
          {submitting ? 'Getting Feedback...' : 'Submit for AI Feedback'}
        </button>
      </div>

      {result && (
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="stat-figure text-4xl font-bold text-brand-500">{result.score}%</div>
            {!result.generatedByAI && <span className="text-xs text-ink-3">(rule-based scoring, no AI key configured)</span>}
          </div>
          <ul className="mt-4 space-y-2">
            {result.feedback.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div className="card overflow-hidden">
          <h2 className="p-6 pb-0 text-lg font-semibold text-ink-1">Past Attempts</h2>
          <div className="mt-4 divide-y divide-surface-border">
            {history.map((a) => (
              <div key={a._id} className="flex items-center justify-between px-6 py-3 text-sm">
                <span className="truncate text-ink-2">{a.prompt}</span>
                <span className="stat-figure shrink-0 text-ink-3">{a.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerWritingPage;
