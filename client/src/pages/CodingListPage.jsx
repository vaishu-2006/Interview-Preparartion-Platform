import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import codingService from '../services/codingService';
import LoadingScreen from '../components/common/LoadingScreen';
import StatCard from '../components/dashboard/StatCard';
import Icon from '../components/icons/Icon';
import useAuth from '../hooks/useAuth';

const DIFFICULTY_STYLES = {
  Easy: 'text-brand-500 bg-brand-600/10',
  Medium: 'text-gold bg-gold/10',
  Hard: 'text-danger bg-danger/10',
};

const CodingListPage = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState(null);
  const [progress, setProgress] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [tab, setTab] = useState('problems'); // problems | leaderboard
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardScope, setLeaderboardScope] = useState('global'); // global | college
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    codingService.listProblems().then((data) => setProblems(data.problems));
    codingService.getProgress().then((data) => setProgress(data.progress));
    codingService.getDailyChallenge().then(setDaily);
  }, []);

  useEffect(() => {
    if (tab !== 'leaderboard') return;
    setLeaderboard(null);
    codingService.getLeaderboard(leaderboardScope === 'college' ? 'college' : undefined).then((data) => setLeaderboard(data.leaderboard));
  }, [tab, leaderboardScope]);

  if (!problems || !progress) return <LoadingScreen label="Loading problems..." />;

  const filtered = difficultyFilter === 'All' ? problems : problems.filter((p) => p.difficulty === difficultyFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Coding Platform</h1>
        <p className="mt-1 text-ink-3">Practice DSA problems across languages with instant feedback.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Problems Solved" value={`${progress.solvedCount}/${progress.totalProblems}`} icon="checkCircle" />
        <StatCard label="Total Attempts" value={progress.totalAttempts} icon="repeat" />
        <StatCard label="Easy / Medium / Hard" value={`${progress.byDifficulty.Easy}/${progress.byDifficulty.Medium}/${progress.byDifficulty.Hard}`} icon="target" />
        <StatCard label="Current Streak" value={`${progress.currentStreak} day${progress.currentStreak === 1 ? '' : 's'}`} icon="trendingUp" />
      </div>

      {daily?.problem && (
        <Link
          to={`/coding/${daily.problem.slug}`}
          className="card flex flex-wrap items-center justify-between gap-3 p-5 transition hover:border-brand-500/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
              <Icon name="calendar" className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Daily Challenge &middot; today</p>
              <p className="font-medium text-ink-1">
                {daily.problem.title}
                <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold align-middle ${DIFFICULTY_STYLES[daily.problem.difficulty]}`}>
                  {daily.problem.difficulty}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {daily.streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                <Icon name="trendingUp" className="h-3.5 w-3.5" /> {daily.streak} day streak
              </span>
            )}
            {daily.solvedToday && <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-brand-500" />}
          </div>
        </Link>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setTab('problems')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === 'problems' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
          }`}
        >
          Problems
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === 'leaderboard' ? 'bg-brand-600/15 text-brand-400' : 'text-ink-2 hover:bg-surface-card'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {tab === 'problems' && (
        <>
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  difficultyFilter === d
                    ? 'border-brand-500 bg-brand-600/10 text-brand-400'
                    : 'border-surface-border text-ink-2 hover:border-brand-500/40'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="card divide-y divide-surface-border overflow-hidden">
            {filtered.map((problem) => (
              <Link
                key={problem.slug}
                to={`/coding/${problem.slug}`}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-surface-card"
              >
                <div className="flex items-center gap-3">
                  {problem.solved ? (
                    <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-brand-500" />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full border-2 border-surface-border" />
                  )}
                  <div>
                    <p className="font-medium text-ink-1">{problem.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {problem.topics.map((t) => (
                        <span key={t} className="rounded bg-surface px-2 py-0.5 text-[11px] text-ink-3">{t}</span>
                      ))}
                      {problem.rating && (
                        <span className="flex items-center gap-1 text-[11px] text-ink-3">
                          <Icon name="checkCircle" className="h-3 w-3 text-gold" />
                          {problem.rating.avgQuality} ({problem.rating.ratingCount})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {tab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardScope('global')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                leaderboardScope === 'global' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setLeaderboardScope('college')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                leaderboardScope === 'college' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              My College
            </button>
          </div>
        <div className="card overflow-hidden">
          {!leaderboard ? (
            <p className="p-6 text-sm text-ink-3">Loading leaderboard...</p>
          ) : !leaderboard.length ? (
            <p className="p-6 text-sm text-ink-3">
              {leaderboardScope === 'college'
                ? 'No solves yet from your college — add your college on your Profile page if you haven\'t, or be the first to solve one.'
                : 'No one has solved a problem yet — be the first.'}
            </p>
          ) : (
            <div className="divide-y divide-surface-border">
              {leaderboard.map((row, idx) => (
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
                  <span className="stat-figure text-ink-2">{row.solvedCount} solved</span>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default CodingListPage;
