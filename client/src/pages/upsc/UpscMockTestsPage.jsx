import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import upscService from '../../services/upscService';
import LoadingScreen from '../../components/common/LoadingScreen';
import AptitudeQuiz from '../../components/aptitude/AptitudeQuiz';
import AptitudeResults from '../../components/aptitude/AptitudeResults';
import RulesGate from '../../components/proctoring/RulesGate';
import Icon from '../../components/icons/Icon';
import useAuth from '../../hooks/useAuth';

const UPSC_RULES = [
  'This is a timed test — the clock keeps running once you start.',
  'Do not switch tabs or windows during the test.',
  'Do not copy questions or paste answers.',
  '3 warnings auto-submits your test.',
];

const UpscMockTestsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('home'); // home | rules | quiz | results
  const [stage, setStage] = useState('Prelims'); // Prelims | Mains | Daily — which test is currently pending/active
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [tab, setTab] = useState('test'); // test | ranking
  const [ranking, setRanking] = useState(null);

  const loadStats = () => upscService.getStats().then((data) => setStats(data.stats));

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === 'ranking' && !ranking) {
      upscService.getRanking().then((data) => setRanking(data.ranking));
    }
  }, [tab, ranking]);

  const startQuiz = async () => {
    setStarting(true);
    try {
      const data = await upscService.getQuiz(stage === 'Daily' ? 10 : 20, stage);
      if (!data.questions.length) {
        toast.error('No questions available yet');
        setView('home');
        return;
      }
      setQuestions(data.questions);
      setView('quiz');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load quiz');
      setView('home');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async (answers, timeTakenSeconds, confidenceScore) => {
    setSubmitting(true);
    try {
      const data = await upscService.submitQuiz({ answers, timeTakenSeconds, confidenceScore, stage });
      setResult(data);
      setView('results');
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attempt');
      setView('home');
    } finally {
      setSubmitting(false);
    }
  };

  if (!stats) return <LoadingScreen label="Loading mock tests..." />;

  if (view === 'rules') {
    return (
      <RulesGate
        title={stage === 'Daily' ? "Today's Current Affairs Quiz" : `UPSC ${stage} Mock Test`}
        rules={
          stage === 'Mains'
            ? [...UPSC_RULES, 'This is the harder Mains-tier set — unlocked because you cleared Prelims.']
            : stage === 'Daily'
            ? [...UPSC_RULES, 'A fresh 10-question Current Affairs set, same for everyone today — comes back tomorrow.']
            : UPSC_RULES
        }
        requiresWebcam
        onStart={startQuiz}
      />
    );
  }

  if (view === 'quiz') {
    return <AptitudeQuiz category={`UPSC ${stage}`} questions={questions} onSubmit={handleSubmit} submitting={submitting} />;
  }

  if (view === 'results' && result) {
    return <AptitudeResults result={result} onRetry={() => setView('rules')} onBack={() => setView('home')} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Mock Tests</h1>
        <p className="mt-1 text-ink-3">Prelims-style GS test series — Polity, Geography, History, Economy, Science & Tech, Environment, Current Affairs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
            <Icon name="flask" className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-1">{stats.totalTests}</p>
            <p className="text-sm text-ink-3">Tests Taken</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15">
            <Icon name="trophy" className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-1">{stats.averageScorePercent}%</p>
            <p className="text-sm text-ink-3">Average Score</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('test')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === 'test' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
          }`}
        >
          Mock Test
        </button>
        <button
          onClick={() => setTab('ranking')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === 'ranking' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
          }`}
        >
          Ranking
        </button>
      </div>

      {tab === 'test' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                <Icon name="newspaper" className="h-5 w-5 text-gold" />
              </div>
              <h2 className="text-lg font-semibold text-ink-1">Daily Current Affairs Quiz</h2>
            </div>
            <p className="mt-3 text-sm text-ink-3">
              10 questions from the Current Affairs category, the same set for everyone today.
              {stats.dailyCompletedToday && ' You’ve already done today’s — come back tomorrow for a new set.'}
            </p>
            <button
              onClick={() => {
                setStage('Daily');
                setView('rules');
              }}
              disabled={starting}
              className="btn-secondary mt-5"
            >
              {stats.dailyCompletedToday ? 'Retake Today’s Quiz' : "Start Today's Quiz"}
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
                <Icon name="flask" className="h-5 w-5 text-brand-500" />
              </div>
              <h2 className="text-lg font-semibold text-ink-1">Prelims Mock Test</h2>
            </div>
            <p className="mt-3 text-sm text-ink-3">
              20-question mixed-category GS set — timed, proctored, retake as many times as you want.
            </p>
            <button
              onClick={() => {
                setStage('Prelims');
                setView('rules');
              }}
              disabled={starting}
              className="btn-primary mt-5"
            >
              Start Prelims Test
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15">
                <Icon name={stats.prelimsCleared ? 'flask' : 'shieldCheck'} className="h-5 w-5 text-brand-500" />
              </div>
              <h2 className="text-lg font-semibold text-ink-1">Mains Mock Test</h2>
            </div>
            {stats.prelimsCleared ? (
              <>
                <p className="mt-3 text-sm text-ink-3">
                  Harder Medium/Hard-weighted GS set — unlocked because you cleared Prelims.
                </p>
                <button
                  onClick={() => {
                    setStage('Mains');
                    setView('rules');
                  }}
                  disabled={starting}
                  className="btn-primary mt-5"
                >
                  Start Mains Test
                </button>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink-3">
                Locked — score {stats.passPercent}%+ on a Prelims mock test to unlock Mains.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === 'ranking' && (
        <div className="card overflow-hidden">
          {!ranking ? (
            <p className="p-6 text-sm text-ink-3">Loading ranking...</p>
          ) : !ranking.length ? (
            <p className="p-6 text-sm text-ink-3">Ranking needs at least 2 mock tests from a candidate — take a few more to appear here.</p>
          ) : (
            <div className="divide-y divide-surface-border">
              {ranking.map((row, idx) => (
                <div
                  key={row.userId}
                  className={`flex items-center justify-between px-6 py-3 text-sm ${
                    row.userId === user?.id ? 'bg-brand-600/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink-2">
                      {idx + 1}
                    </span>
                    {idx < 3 && <Icon name="trophy" className="h-4 w-4 text-gold" />}
                    <span className="text-ink-1">{row.name}{row.userId === user?.id ? ' (you)' : ''}</span>
                  </div>
                  <span className="stat-figure text-ink-2">{row.averageScorePercent}% avg · {row.attempts} tests</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpscMockTestsPage;
