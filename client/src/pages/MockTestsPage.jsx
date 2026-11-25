import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import aptitudeService from '../services/aptitudeService';
import codingService from '../services/codingService';
import AptitudeQuiz from '../components/aptitude/AptitudeQuiz';
import CodeEditor from '../components/coding/CodeEditor';
import ConsolePanel from '../components/coding/ConsolePanel';
import Icon from '../components/icons/Icon';
import RulesGate from '../components/proctoring/RulesGate';
import ViolationBadge from '../components/proctoring/ViolationBadge';
import ProctoringCameraWidget from '../components/proctoring/ProctoringCameraWidget';
import ConfidenceStat from '../components/proctoring/ConfidenceStat';
import { averageConfidence } from '../utils/confidence';
import useProctoring from '../hooks/useProctoring';

const APTITUDE_RULES = [
  'This is a timed test — the clock keeps running once you start.',
  'Do not switch tabs or windows during the test.',
  'Do not copy questions or paste answers.',
  'Right-click and developer tools are disabled during the test.',
  '3 warnings auto-submits your test.',
];
const CODING_RULES = [
  'Do not switch tabs or windows while solving.',
  'Do not copy the problem statement or paste in a solution.',
  'Right-click and developer tools are disabled during the test.',
  '3 warnings auto-submits your current code.',
];

const APTITUDE_CATEGORIES = ['Numerical', 'Logical', 'Verbal', 'Non-Verbal'];
const QUESTIONS_PER_CATEGORY = 5;
const CODING_DIFFICULTIES = ['Easy', 'Medium'];
const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
];

const ScoreBar = ({ label, percent }) => (
  <div>
    <div className="flex items-center justify-between text-xs text-ink-3">
      <span>{label}</span>
      <span className="font-mono text-ink-1">{percent}%</span>
    </div>
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-card">
      <div
        className={`h-full transition-all ${percent >= 60 ? 'bg-brand-600' : percent >= 40 ? 'bg-gold' : 'bg-danger'}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const MockTestsPage = () => {
  const [activeTest, setActiveTest] = useState(null); // null | 'aptitude' | 'coding'

  // --- Full Aptitude Mock Test state ---
  const [aptPhase, setAptPhase] = useState('idle'); // idle | rules | running | results
  const [aptStarting, setAptStarting] = useState(false);
  const [aptSets, setAptSets] = useState([]);
  const [aptIndex, setAptIndex] = useState(0);
  const [aptResults, setAptResults] = useState([]);
  const [aptSubmitting, setAptSubmitting] = useState(false);

  // --- Coding Mock Test state ---
  const [codePhase, setCodePhase] = useState('idle'); // idle | rules | running | results
  const [codeStarting, setCodeStarting] = useState(false);
  const [codeProblems, setCodeProblems] = useState([]);
  const [codeIndex, setCodeIndex] = useState(0);
  const [codeResults, setCodeResults] = useState([]);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const codeConfidenceSamplesRef = useRef([]);

  const startAptitudeTest = async () => {
    setAptStarting(true);
    try {
      const sets = await Promise.all(
        APTITUDE_CATEGORIES.map(async (category) => {
          const data = await aptitudeService.getQuiz(category, QUESTIONS_PER_CATEGORY);
          return { category, questions: data.questions };
        })
      );
      if (sets.some((s) => !s.questions.length)) {
        toast.error('Not enough questions available yet in one of the categories');
        return;
      }
      setAptSets(sets);
      setAptIndex(0);
      setAptResults([]);
      setAptPhase('running');
      setActiveTest('aptitude');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start the mock test');
    } finally {
      setAptStarting(false);
    }
  };

  const handleAptSubmit = async (answers, timeTakenSeconds, confidenceScore) => {
    setAptSubmitting(true);
    try {
      const category = aptSets[aptIndex].category;
      const data = await aptitudeService.submitAttempt({ category, answers, timeTakenSeconds, confidenceScore });
      const nextResults = [...aptResults, { category, score: data.score, totalQuestions: data.totalQuestions, confidenceScore }];
      setAptResults(nextResults);
      if (aptIndex + 1 < aptSets.length) {
        setAptIndex((i) => i + 1);
      } else {
        setAptPhase('results');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answers');
    } finally {
      setAptSubmitting(false);
    }
  };

  const startCodingTest = async () => {
    setCodeStarting(true);
    try {
      const lists = await Promise.all(
        CODING_DIFFICULTIES.map((difficulty) => codingService.listProblems({ difficulty }).then((data) => data.problems))
      );
      if (lists.some((l) => !l.length)) {
        toast.error('Not enough coding problems available yet at one of the difficulty levels');
        return;
      }
      const chosenSlugs = lists.map((list) => list[Math.floor(Math.random() * list.length)].slug);
      const problems = await Promise.all(chosenSlugs.map((slug) => codingService.getProblem(slug).then((data) => data.problem)));
      setCodeProblems(problems);
      setCodeIndex(0);
      setCodeResults([]);
      setCode(problems[0].starterCode[language] || '');
      setRunResult(null);
      setCodePhase('running');
      setActiveTest('coding');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start the mock test');
    } finally {
      setCodeStarting(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(codeProblems[codeIndex].starterCode[lang] || '');
  };

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const data = await codingService.runCode(codeProblems[codeIndex].slug, { language, code });
      setRunResult(data.result);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run code');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmittingCode(true);
    setRunResult(null);
    try {
      const problem = codeProblems[codeIndex];
      const samples = codeConfidenceSamplesRef.current;
      const confidenceScore = samples.length
        ? Math.round(samples.reduce((sum, s) => sum + s.confidenceScore, 0) / samples.length)
        : null;
      const data = await codingService.submitCode(problem.slug, { language, code, confidenceScore });
      setRunResult(data);
      const nextResults = [
        ...codeResults,
        {
          title: problem.title,
          difficulty: problem.difficulty,
          passedTestCases: data.passedTestCases,
          totalTestCases: data.totalTestCases,
          confidenceScore: data.confidenceScore,
        },
      ];
      setCodeResults(nextResults);
      if (codeIndex + 1 < codeProblems.length) {
        const next = codeIndex + 1;
        setCodeIndex(next);
        setCode(codeProblems[next].starterCode[language] || '');
        setRunResult(null);
      } else {
        setCodePhase('results');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setSubmittingCode(false);
    }
  };

  const resetToHome = () => {
    setActiveTest(null);
    setAptPhase('idle');
    setCodePhase('idle');
  };

  const codeProctoring = useProctoring({ enabled: codePhase === 'running' && !submittingCode, onAutoSubmit: handleSubmitCode });

  // --- Aptitude: rules ---
  if (activeTest === 'aptitude' && aptPhase === 'rules') {
    return <RulesGate title="Full Aptitude Mock Test" rules={APTITUDE_RULES} requiresWebcam onStart={startAptitudeTest} />;
  }

  // --- Coding: rules ---
  if (activeTest === 'coding' && codePhase === 'rules') {
    return <RulesGate title="Coding Mock Test" rules={CODING_RULES} requiresWebcam onStart={startCodingTest} />;
  }

  // --- Aptitude: running ---
  if (activeTest === 'aptitude' && aptPhase === 'running') {
    const set = aptSets[aptIndex];
    return (
      <div className="space-y-3">
        <p className="text-center text-xs text-ink-3">Section {aptIndex + 1} of {aptSets.length} · Full Aptitude Mock Test</p>
        <AptitudeQuiz key={set.category} category={set.category} questions={set.questions} onSubmit={handleAptSubmit} submitting={aptSubmitting} />
      </div>
    );
  }

  // --- Aptitude: results ---
  if (activeTest === 'aptitude' && aptPhase === 'results') {
    const totalScore = aptResults.reduce((s, r) => s + r.score, 0);
    const totalQuestions = aptResults.reduce((s, r) => s + r.totalQuestions, 0);
    const percent = totalQuestions ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const ranked = [...aptResults].sort(
      (a, b) => (a.totalQuestions ? a.score / a.totalQuestions : 0) - (b.totalQuestions ? b.score / b.totalQuestions : 0)
    );
    const weakestApt = ranked[0];
    const strongestApt = ranked[ranked.length - 1];
    const avgConfidence = averageConfidence(aptResults.map((r) => r.confidenceScore));
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="card p-6 text-center">
          <h2 className="text-lg font-semibold text-ink-1">Full Aptitude Mock Test — Results</h2>
          <div className="mt-4 stat-figure text-5xl font-bold text-brand-500">{percent}%</div>
          <p className="mt-1 text-sm text-ink-3">{totalScore} / {totalQuestions} correct</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
              <p className="stat-figure text-lg font-semibold text-brand-500">{totalScore}</p>
              <p className="text-xs text-ink-3">Correct</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
              <p className="stat-figure text-lg font-semibold text-danger">{totalQuestions - totalScore}</p>
              <p className="text-xs text-ink-3">Incorrect</p>
            </div>
          </div>
          <ConfidenceStat score={avgConfidence} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-semibold text-ink-1">Detailed Report</h3>
          <p className="mt-3 font-medium text-ink-1">
            {weakestApt ? `Weakest section: ${weakestApt.category} (${weakestApt.score}/${weakestApt.totalQuestions} correct)` : 'No clear weak area detected.'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {weakestApt &&
              `You scored ${percent}% overall across all 4 sections. ${weakestApt.category} was your weakest at ` +
                `${weakestApt.totalQuestions ? Math.round((weakestApt.score / weakestApt.totalQuestions) * 100) : 0}%` +
                (strongestApt && strongestApt !== weakestApt
                  ? `, while ${strongestApt.category} was your strongest at ${Math.round((strongestApt.score / strongestApt.totalQuestions) * 100)}%.`
                  : '.')}
          </p>
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">What To Do Next</h4>
            <ul className="mt-2.5 space-y-2">
              {weakestApt && (
                <li className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  Spend more practice time on {weakestApt.category} in the Aptitude section before your next full mock test.
                </li>
              )}
              <li className="flex items-start gap-2.5 text-sm text-ink-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Retake this full mock test once you've closed the gap to confirm your improvement across all 4 sections.
              </li>
              {avgConfidence !== null && avgConfidence < 45 && (
                <li className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  Your on-camera confidence was low this attempt — timed practice under proctoring will help build it up.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="card space-y-4 p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Section Breakdown</h4>
          {aptResults.map((r) => (
            <ScoreBar key={r.category} label={r.category} percent={r.totalQuestions ? Math.round((r.score / r.totalQuestions) * 100) : 0} />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAptPhase('rules')} className="btn-secondary flex-1">Retake</button>
          <button onClick={resetToHome} className="btn-primary flex-1">Back to Mock Tests</button>
        </div>
      </div>
    );
  }

  // --- Coding: running ---
  if (activeTest === 'coding' && codePhase === 'running' && codeProblems.length) {
    const problem = codeProblems[codeIndex];
    const isLast = codeIndex === codeProblems.length - 1;
    return (
      <div className="space-y-4">
        <ProctoringCameraWidget
          onSample={(sample) => codeConfidenceSamplesRef.current.push(sample)}
          onLookAway={() => codeProctoring.flag('looking_away')}
        />
        <p className="text-center text-xs text-ink-3">Problem {codeIndex + 1} of {codeProblems.length} · Coding Mock Test</p>
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
          <div className="flex items-center gap-2">
            <ViolationBadge count={codeProctoring.violationCount} max={codeProctoring.maxViolations} />
            <button onClick={handleRun} disabled={running} className="btn-secondary text-sm">
              {running ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmitCode} disabled={submittingCode} className="btn-primary text-sm">
              {submittingCode ? 'Submitting...' : isLast ? 'Submit & Finish Test' : 'Submit & Next Problem'}
            </button>
          </div>
        </div>

        <CodeEditor language={language} value={code} onChange={setCode} />
        <ConsolePanel result={runResult} />
      </div>
    );
  }

  // --- Coding: results ---
  if (activeTest === 'coding' && codePhase === 'results') {
    const percents = codeResults.map((r) => (r.totalTestCases ? Math.round((r.passedTestCases / r.totalTestCases) * 100) : 0));
    const overall = percents.length ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length) : 0;
    const ranked = codeResults.map((r, i) => ({ ...r, percent: percents[i] })).sort((a, b) => a.percent - b.percent);
    const weakestCode = ranked[0];
    const strongestCode = ranked[ranked.length - 1];
    const totalPassed = codeResults.reduce((s, r) => s + r.passedTestCases, 0);
    const totalCases = codeResults.reduce((s, r) => s + r.totalTestCases, 0);
    const avgConfidence = averageConfidence(codeResults.map((r) => r.confidenceScore));
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="card p-6 text-center">
          <h2 className="text-lg font-semibold text-ink-1">Coding Mock Test — Results</h2>
          <div className="mt-4 stat-figure text-5xl font-bold text-brand-500">{overall}%</div>
          <p className="mt-1 text-sm text-ink-3">Average test cases passed across {codeResults.length} problems</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
              <p className="stat-figure text-lg font-semibold text-brand-500">{totalPassed}</p>
              <p className="text-xs text-ink-3">Test Cases Passed</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface p-3 text-center">
              <p className="stat-figure text-lg font-semibold text-danger">{totalCases - totalPassed}</p>
              <p className="text-xs text-ink-3">Test Cases Failed</p>
            </div>
          </div>
          <ConfidenceStat score={avgConfidence} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-semibold text-ink-1">Detailed Report</h3>
          <p className="mt-3 font-medium text-ink-1">
            {weakestCode
              ? `Weakest problem: ${weakestCode.title} (${weakestCode.difficulty}) — ${weakestCode.passedTestCases}/${weakestCode.totalTestCases} test cases passed`
              : 'No clear weak area detected.'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {weakestCode &&
              `You passed ${overall}% of test cases overall across ${codeResults.length} problems. ${weakestCode.title} was your weakest submission at ${weakestCode.percent}%` +
                (strongestCode && strongestCode !== weakestCode
                  ? `, while ${strongestCode.title} was your strongest at ${strongestCode.percent}%.`
                  : '.')}
          </p>
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">What To Do Next</h4>
            <ul className="mt-2.5 space-y-2">
              {weakestCode && (
                <li className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  Revisit {weakestCode.difficulty}-tier problems in the Coding section, or use AI Code Review on similar problems.
                </li>
              )}
              <li className="flex items-start gap-2.5 text-sm text-ink-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Retake this coding mock test with a fresh pair of problems once you've practiced more.
              </li>
              {avgConfidence !== null && avgConfidence < 45 && (
                <li className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  Your on-camera confidence was low this attempt — timed practice under proctoring will help build it up.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="card space-y-4 p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">Problem Breakdown</h4>
          {codeResults.map((r, i) => (
            <ScoreBar
              key={`${r.title}-${i}`}
              label={`${r.title} (${r.difficulty})`}
              percent={r.totalTestCases ? Math.round((r.passedTestCases / r.totalTestCases) * 100) : 0}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCodePhase('rules')} className="btn-secondary flex-1">Retake</button>
          <button onClick={resetToHome} className="btn-primary flex-1">Back to Mock Tests</button>
        </div>
      </div>
    );
  }

  // --- Home ---
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Mock Tests & Assessments</h1>
        <p className="mt-1 text-ink-3">Full-length, timed practice tests you can retake as many times as you want — separate from open-ended practice.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
              <Icon name="calculator" className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-1">Full Aptitude Mock Test</h2>
              <p className="mt-0.5 text-sm text-ink-3">
                {QUESTIONS_PER_CATEGORY * APTITUDE_CATEGORIES.length} questions across all 4 categories (Numerical, Logical,
                Verbal, Non-Verbal), timed section by section.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTest('aptitude');
              setAptPhase('rules');
            }}
            disabled={aptStarting}
            className="btn-primary mt-5"
          >
            Start Test
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
              <Icon name="code" className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-1">Coding Mock Test</h2>
              <p className="mt-0.5 text-sm text-ink-3">
                2 problems (1 Easy, 1 Medium) back-to-back, scored on test cases passed — a realistic online-assessment
                simulation.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTest('coding');
              setCodePhase('rules');
            }}
            disabled={codeStarting}
            className="btn-primary mt-5"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockTestsPage;
