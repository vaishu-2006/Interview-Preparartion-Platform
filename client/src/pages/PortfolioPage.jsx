import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import portfolioService from '../services/portfolioService';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';

const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="stat-figure text-lg font-semibold text-ink-1">{value}</p>
    <p className="text-xs text-ink-3">{label}</p>
  </div>
);

// Public, no-auth page — reachable only via a slug the owning student explicitly opted to
// share. Shows real, already-recorded activity only (level, points, badges, course stats),
// nothing fabricated and nothing beyond what portfolioService.getPublicPortfolio exposes.
const PortfolioPage = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    portfolioService
      .getPublicPortfolio(slug)
      .then((data) => setPortfolio(data.portfolio))
      .catch(() => setPortfolio(null));
  }, [slug]);

  if (portfolio === undefined) return <LoadingScreen label="Loading portfolio..." />;

  if (!portfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <p className="text-ink-2">This portfolio isn't available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600/15">
            <Icon name="user" className="h-8 w-8 text-brand-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink-1">{portfolio.name}</h1>
          <p className="mt-1 text-ink-3">{portfolio.course}{portfolio.branch ? ` · ${portfolio.branch}` : ''}</p>
          <p className="mt-4 stat-figure text-lg font-semibold text-brand-500">Level {portfolio.level} &mdash; {portfolio.levelTitle}</p>
          <p className="text-xs text-ink-3">{portfolio.points} points</p>
        </div>

        {portfolio.courseStats && (
          <div className="card grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
            {portfolio.course === 'UPSC' ? (
              <>
                <Stat label="Tests Taken" value={portfolio.courseStats.totalTests} />
                <Stat label="Avg Score" value={`${portfolio.courseStats.averageScorePercent}%`} />
                <Stat label="Prelims" value={portfolio.courseStats.prelimsCleared ? 'Cleared' : 'In progress'} />
              </>
            ) : (
              <>
                <Stat label="Problems Solved" value={`${portfolio.courseStats.solvedCount}/${portfolio.courseStats.totalProblems}`} />
                <Stat label="Current Streak" value={`${portfolio.courseStats.currentStreak}d`} />
                <Stat label="Weekend Contests" value={portfolio.courseStats.contestsParticipated} />
              </>
            )}
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-1">Badges ({portfolio.unlockedCount}/{portfolio.totalBadges})</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {portfolio.badges.length ? (
              portfolio.badges.map((b) => (
                <span key={b.id} className="rounded-full bg-brand-600/10 px-3 py-1.5 text-xs font-medium text-brand-400" title={b.description}>
                  {b.label}
                </span>
              ))
            ) : (
              <p className="text-sm text-ink-3">No badges unlocked yet.</p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-ink-3">Real, verified activity only &mdash; shared by choice.</p>
      </div>
    </div>
  );
};

export default PortfolioPage;
