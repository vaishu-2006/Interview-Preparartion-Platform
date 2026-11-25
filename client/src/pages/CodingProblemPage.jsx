import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import codingService from '../services/codingService';
import LoadingScreen from '../components/common/LoadingScreen';
import CodeEditor from '../components/coding/CodeEditor';
import ConsolePanel from '../components/coding/ConsolePanel';
import DiscussionBoard from '../components/coding/DiscussionBoard';
import CompanyTagChips from '../components/coding/CompanyTagChips';
import ProblemRatingWidget from '../components/coding/ProblemRatingWidget';
import RulesGate from '../components/proctoring/RulesGate';
import ViolationBadge from '../components/proctoring/ViolationBadge';
import useProctoring from '../hooks/useProctoring';

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
];

const CODING_RULES = [
  'Do not switch tabs or windows while solving.',
  'Do not copy the problem statement or paste in a solution.',
  'Right-click and developer tools are disabled during the test.',
  '3 warnings auto-submits your current code.',
];

const DIFFICULTY_STYLES = {
  Easy: 'text-brand-500 bg-brand-600/10',
  Medium: 'text-gold bg-gold/10',
  Hard: 'text-danger bg-danger/10',
};

const CodingProblemPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const contestId = searchParams.get('contestId') || undefined;
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [revealedHints, setRevealedHints] = useState(-1);
  const [showEditorial, setShowEditorial] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState(null);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState(null);

  useEffect(() => {
    setProblem(null);
    setResult(null);
    codingService.getProblem(slug).then((data) => {
      setProblem(data.problem);
      setCode(data.problem.starterCode[language] || '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang] || '');
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    try {
      const data = await codingService.runCode(slug, { language, code, customInput: customInput || undefined });
      setResult(data.result);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run code');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const data = await codingService.submitCode(slug, { language, code, contestId });
      setResult(data);
      if (data.status === 'Accepted') toast.success(contestId ? 'Accepted! Contest solve recorded.' : 'Accepted! All test cases passed.');
      else toast.error(data.status);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewCode = async () => {
    setReviewing(true);
    setReview(null);
    try {
      const data = await codingService.reviewCode(slug, { language, code });
      setReview(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get AI review');
    } finally {
      setReviewing(false);
    }
  };

  const handleExplainFailure = async () => {
    const failing = result?.results?.find((r) => !r.passed && !r.isHidden);
    if (!failing) return;
    setExplaining(true);
    setExplanation(null);
    try {
      const data = await codingService.explainFailure(slug, {
        language,
        code,
        input: failing.input,
        expectedOutput: failing.expectedOutput,
        actualOutput: failing.actualOutput,
      });
      setExplanation(data.explanation);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get an explanation');
    } finally {
      setExplaining(false);
    }
  };

  const proctoring = useProctoring({ enabled: started && !submitting, onAutoSubmit: handleSubmit });

  if (!problem) return <LoadingScreen label="Loading problem..." />;

  if (!started) {
    return <RulesGate title={problem.title} rules={CODING_RULES} onStart={() => setStarted(true)} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="space-y-4">
        <Link to={contestId ? '/contest' : '/coding'} className="text-sm text-ink-3 hover:text-ink-1">
          &larr; Back to {contestId ? 'Weekend Contest' : 'problems'}
        </Link>

        {contestId && (
          <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-gold">
            Contest Mode — solving this counts toward the Weekend Coding Contest leaderboard and earns a bonus on top of the normal solve points.
          </div>
        )}

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-ink-1">{problem.title}</h1>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_STYLES[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {problem.topics.map((t) => (
              <span key={t} className="rounded bg-surface px-2 py-0.5 text-[11px] text-ink-3">{t}</span>
            ))}
          </div>

          <CompanyTagChips slug={slug} />
          <ProblemRatingWidget slug={slug} />

          <p className="mt-4 whitespace-pre-line text-sm text-ink-2">{problem.statement}</p>

          {problem.inputFormat && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Input Format</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-2">{problem.inputFormat}</p>
            </div>
          )}
          {problem.outputFormat && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Output Format</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-2">{problem.outputFormat}</p>
            </div>
          )}
          {problem.constraints && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Constraints</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-2">{problem.constraints}</p>
            </div>
          )}

          {problem.examples.map((ex, idx) => (
            <div key={idx} className="mt-4 rounded-lg bg-surface p-3 font-mono text-xs text-ink-2">
              <p><span className="text-ink-3">Input:</span> {ex.input}</p>
              <p><span className="text-ink-3">Output:</span> {ex.output}</p>
              {ex.explanation && <p className="mt-1 text-ink-3">{ex.explanation}</p>}
            </div>
          ))}
        </div>

        {problem.hints?.length > 0 && (
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink-1">Hints</h3>
            <div className="mt-3 space-y-2">
              {problem.hints.slice(0, revealedHints + 1).map((hint, idx) => (
                <p key={idx} className="rounded-lg bg-surface p-3 text-sm text-ink-2">
                  <span className="font-medium text-brand-400">Hint {idx + 1}:</span> {hint}
                </p>
              ))}
              {revealedHints < problem.hints.length - 1 && (
                <button onClick={() => setRevealedHints((h) => h + 1)} className="btn-secondary text-sm">
                  Show Hint {revealedHints + 2}
                </button>
              )}
            </div>
          </div>
        )}

        {problem.editorial && (
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-1">Editorial</h3>
              <button onClick={() => setShowEditorial((s) => !s)} className="btn-secondary text-sm">
                {showEditorial ? 'Hide' : 'Reveal'}
              </button>
            </div>
            {showEditorial ? (
              <p className="mt-3 whitespace-pre-line text-sm text-ink-2">{problem.editorial}</p>
            ) : (
              <p className="mt-3 text-sm text-ink-3">Try solving it yourself first — the editorial explains the intended approach.</p>
            )}
          </div>
        )}

        <DiscussionBoard slug={slug} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => handleLanguageChange(l.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  language === l.id
                    ? 'border-brand-500 bg-brand-600/10 text-brand-400'
                    : 'border-surface-border text-ink-2 hover:border-brand-500/40'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ViolationBadge count={proctoring.violationCount} max={proctoring.maxViolations} />
            <button onClick={handleReviewCode} disabled={reviewing || !code.trim()} className="btn-secondary text-sm">
              {reviewing ? 'Reviewing...' : 'AI Code Review'}
            </button>
            <button onClick={handleRun} disabled={running} className="btn-secondary text-sm">
              {running ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {review && (
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-1">AI Code Review</h3>
              {!review.generatedByAI && <span className="text-xs text-ink-3">(rule-based, no AI key configured)</span>}
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
              {review.feedback.map((f, i) => (
                <li key={i}>&bull; {f}</li>
              ))}
            </ul>
          </div>
        )}

        <CodeEditor language={language} value={code} onChange={setCode} />

        <div>
          <label className="label-text">Custom Input (used by Run only)</label>
          <textarea
            className="input-field min-h-[70px] resize-y font-mono text-xs"
            placeholder="Leave empty to run against the first example"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        </div>

        <ConsolePanel result={result} />

        {result?.status === 'Ran' && (
          <p className="text-xs text-ink-3">
            This only ran your code against the input above — it doesn't check your solution against every test case.
            Click <span className="font-medium text-ink-2">Submit</span> to see a full pass/fail breakdown.
          </p>
        )}

        {result?.results && (
          <div className="card p-6">
            <h3 className="text-base font-semibold text-ink-1">Detailed Report</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
                <p className="stat-figure text-lg font-semibold text-brand-500">{result.passedTestCases}</p>
                <p className="text-xs text-ink-3">Test Cases Passed</p>
              </div>
              <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
                <p className="stat-figure text-lg font-semibold text-danger">{result.totalTestCases - result.passedTestCases}</p>
                <p className="text-xs text-ink-3">Test Cases Failed</p>
              </div>
            </div>
            <p className="mt-4 font-medium text-ink-1">
              {result.status === 'Accepted'
                ? `Accepted — all ${result.totalTestCases} test cases passed.`
                : `${result.status} — ${result.passedTestCases}/${result.totalTestCases} test cases passed.`}
            </p>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">What To Do Next</h4>
              <ul className="mt-2.5 space-y-2">
                {result.status === 'Accepted' ? (
                  <li className="flex items-start gap-2.5 text-sm text-ink-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    No skill gap detected on this problem — try a harder difficulty tier next.
                  </li>
                ) : (
                  <>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      Review the failing case in the console output above.
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      Use a Hint or the Editorial above if you're stuck, or try AI Code Review for feedback on your current code.
                    </li>
                  </>
                )}
              </ul>
            </div>

            {result.status !== 'Accepted' && result.results?.some((r) => !r.passed && !r.isHidden) && (
              <div className="mt-4">
                <button onClick={handleExplainFailure} disabled={explaining} className="btn-secondary text-sm">
                  {explaining ? 'Explaining...' : 'Explain My Mistake'}
                </button>
                {explanation && (
                  <p className="mt-3 rounded-lg bg-surface p-3 text-sm leading-relaxed text-ink-2">{explanation}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingProblemPage;
