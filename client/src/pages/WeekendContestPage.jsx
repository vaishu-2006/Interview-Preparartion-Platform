import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import contestService from '../services/contestService';
import contestTeamService from '../services/contestTeamService';
import LoadingScreen from '../components/common/LoadingScreen';
import Icon from '../components/icons/Icon';

const DIFFICULTY_STYLES = {
  Easy: 'text-brand-500 bg-brand-600/10',
  Medium: 'text-gold bg-gold/10',
  Hard: 'text-danger bg-danger/10',
};

const formatCountdown = (target, now) => {
  const diffMs = new Date(target) - now;
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const WeekendContestPage = () => {
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardScope, setLeaderboardScope] = useState('global'); // global | college | team
  const [myStats, setMyStats] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [previousContest, setPreviousContest] = useState(undefined); // undefined = loading, null = none
  const [previousLeaderboard, setPreviousLeaderboard] = useState(null);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  const [myTeam, setMyTeam] = useState(undefined); // undefined = loading, null = not in a team
  const [teamForm, setTeamForm] = useState({ mode: 'create', name: '', inviteCode: '' });
  const [teamSaving, setTeamSaving] = useState(false);

  const loadMyTeam = () => contestTeamService.getMyTeam().then((data) => setMyTeam(data.team));

  useEffect(() => {
    contestService.getCurrent().then((data) => setContest(data.contest));
    contestService.getMyStats().then((data) => setMyStats(data.stats));
    contestService.getPrevious().then((data) => setPreviousContest(data.contest));
    loadMyTeam();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setTeamSaving(true);
    try {
      await contestTeamService.createTeam(teamForm.name.trim());
      toast.success('Team created — share your invite code with teammates.');
      setTeamForm({ mode: 'create', name: '', inviteCode: '' });
      await loadMyTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setTeamSaving(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.inviteCode.trim()) return;
    setTeamSaving(true);
    try {
      await contestTeamService.joinTeam(teamForm.inviteCode.trim());
      toast.success('Joined the team!');
      setTeamForm({ mode: 'create', name: '', inviteCode: '' });
      await loadMyTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join team');
    } finally {
      setTeamSaving(false);
    }
  };

  const handleLeaveTeam = async () => {
    setTeamSaving(true);
    try {
      await contestTeamService.leaveTeam();
      toast.success('Left the team');
      await loadMyTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave team');
    } finally {
      setTeamSaving(false);
    }
  };

  useEffect(() => {
    if (!previousContest) return;
    contestService.getLeaderboard(previousContest.id).then((data) => setPreviousLeaderboard(data.leaderboard));
  }, [previousContest]);

  const myPreviousRank = previousLeaderboard?.findIndex((row) => row.userId === currentUserId);
  const isCertificateEligible = myPreviousRank !== undefined && myPreviousRank !== -1 && myPreviousRank < 5;

  const handleDownloadCertificate = async () => {
    setDownloadingCertificate(true);
    try {
      await contestService.downloadCertificate(previousContest.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download certificate');
    } finally {
      setDownloadingCertificate(false);
    }
  };

  useEffect(() => {
    if (!contest) return undefined;
    setLeaderboard(null);
    if (leaderboardScope === 'team') {
      contestTeamService.getTeamLeaderboard(contest.id).then((data) => setLeaderboard(data.leaderboard));
    } else {
      contestService.getLeaderboard(contest.id, leaderboardScope === 'college' ? 'college' : undefined).then((data) => setLeaderboard(data.leaderboard));
    }
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [contest, leaderboardScope]);

  if (!contest) return <LoadingScreen label="Loading this weekend's contest..." />;

  const countdown = contest.isLive ? formatCountdown(contest.endsAt, now) : formatCountdown(contest.startsAt, now);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Weekend Coding Contest</h1>
        <p className="mt-1 text-ink-3">
          A fresh 5-problem set every weekend (Sat 00:00 &ndash; Sun 23:59). Solve for a {contest.bonusPointsPerSolve}-point
          bonus per problem, on top of the usual first-solve points, and climb this weekend's leaderboard.
        </p>
      </div>

      <div className={`card flex flex-wrap items-center justify-between gap-4 p-6 ${contest.isLive ? 'border-brand-500/40' : ''}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${contest.isLive ? 'bg-brand-600/15' : 'bg-surface'}`}>
            <Icon name="trophy" className={`h-5 w-5 ${contest.isLive ? 'text-brand-500' : 'text-ink-3'}`} />
          </div>
          <div>
            <p className="font-semibold text-ink-1">{contest.isLive ? 'Live now' : 'Opens Saturday'}</p>
            <p className="text-xs text-ink-3">
              {new Date(contest.startsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              {' – '}
              {new Date(contest.endsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        {countdown && (
          <div className="text-right">
            <p className="stat-figure text-lg font-semibold text-ink-1">{countdown}</p>
            <p className="text-xs text-ink-3">{contest.isLive ? 'left in this contest' : 'until it opens'}</p>
          </div>
        )}
        <p className="text-sm text-ink-2">
          You've solved <span className="font-semibold text-brand-500">{contest.solvedCount}</span> of {contest.problems.length}
        </p>
      </div>

      {myStats && (myStats.contestsParticipated > 0) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card flex items-center gap-3 p-4">
            <Icon name="checkCircle" className="h-5 w-5 text-brand-500" />
            <div>
              <p className="stat-figure text-lg font-semibold text-ink-1">{myStats.contestsParticipated}</p>
              <p className="text-xs text-ink-3">Weekends Participated</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <Icon name="trendingUp" className="h-5 w-5 text-gold" />
            <div>
              <p className="stat-figure text-lg font-semibold text-ink-1">{myStats.currentStreak}</p>
              <p className="text-xs text-ink-3">Weekend Streak</p>
            </div>
          </div>
        </div>
      )}

      {!contest.isLive && (
        <div className="rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm text-ink-3">
          This weekend's problems are visible now, but submissions only count toward the contest leaderboard and bonus
          points once the window opens on Saturday.
        </div>
      )}

      {isCertificateEligible && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-gold/40 bg-gold/5 p-5">
          <div className="flex items-center gap-3">
            <Icon name="trophy" className="h-6 w-6 text-gold" />
            <div>
              <p className="font-semibold text-ink-1">You placed #{myPreviousRank + 1} last weekend!</p>
              <p className="text-xs text-ink-3">Download your certificate for the {new Date(previousContest.startsAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} contest.</p>
            </div>
          </div>
          <button onClick={handleDownloadCertificate} disabled={downloadingCertificate} className="btn-secondary text-sm">
            {downloadingCertificate ? 'Downloading...' : 'Download Certificate'}
          </button>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-ink-1">My Team</h2>
        <p className="mt-1 text-xs text-ink-3">
          Team score is always the live sum of your teammates' real solves this weekend — no separate tracked total.
        </p>
        {myTeam === undefined ? (
          <p className="mt-3 text-sm text-ink-3">Loading...</p>
        ) : myTeam ? (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink-1">{myTeam.name}</p>
                <p className="text-xs text-ink-3">
                  Invite code: <span className="stat-figure font-semibold text-brand-400">{myTeam.inviteCode}</span> &middot; share it with teammates
                </p>
              </div>
              <button onClick={handleLeaveTeam} disabled={teamSaving} className="btn-secondary text-xs">
                {teamSaving ? 'Leaving...' : 'Leave Team'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {myTeam.members.map((m) => (
                <span key={m.id} className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-2">{m.name}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex gap-2">
              <button
                onClick={() => setTeamForm((f) => ({ ...f, mode: 'create' }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${teamForm.mode === 'create' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
              >
                Create a Team
              </button>
              <button
                onClick={() => setTeamForm((f) => ({ ...f, mode: 'join' }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${teamForm.mode === 'join' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'}`}
              >
                Join with Code
              </button>
            </div>
            {teamForm.mode === 'create' ? (
              <form onSubmit={handleCreateTeam} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={teamForm.name}
                  onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Team name"
                  className="input-field flex-1"
                />
                <button type="submit" disabled={teamSaving || !teamForm.name.trim()} className="btn-primary shrink-0 px-5 text-sm">
                  {teamSaving ? 'Creating...' : 'Create'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoinTeam} className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={teamForm.inviteCode}
                  onChange={(e) => setTeamForm((f) => ({ ...f, inviteCode: e.target.value.toUpperCase() }))}
                  placeholder="Invite code"
                  className="input-field flex-1 uppercase"
                />
                <button type="submit" disabled={teamSaving || !teamForm.inviteCode.trim()} className="btn-primary shrink-0 px-5 text-sm">
                  {teamSaving ? 'Joining...' : 'Join'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink-1">This Weekend's Problems</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {contest.problems.map((p) => (
            <Link
              key={p.slug}
              to={`/coding/${p.slug}?contestId=${contest.id}`}
              className="card flex items-center justify-between gap-3 p-5 transition hover:border-brand-500/40"
            >
              <div>
                <p className="font-medium text-ink-1">{p.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${DIFFICULTY_STYLES[p.difficulty]}`}>
                  {p.difficulty}
                </span>
              </div>
              {p.solved && <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-brand-500" />}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-1">Leaderboard</h2>
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
            <button
              onClick={() => setLeaderboardScope('team')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                leaderboardScope === 'team' ? 'border-brand-500 bg-brand-600/10 text-brand-400' : 'border-surface-border text-ink-2'
              }`}
            >
              Teams
            </button>
          </div>
        </div>
        <div className="card overflow-hidden">
          {!leaderboard ? (
            <p className="p-6 text-sm text-ink-3">Loading...</p>
          ) : !leaderboard.length ? (
            <p className="p-6 text-sm text-ink-3">
              {leaderboardScope === 'college'
                ? 'No solves yet from your college this weekend.'
                : leaderboardScope === 'team'
                ? 'No team has a solve yet this weekend — form a team above and get started.'
                : 'No solves yet this weekend — be the first on the board.'}
            </p>
          ) : leaderboardScope === 'team' ? (
            <div className="divide-y divide-surface-border">
              {leaderboard.map((row, idx) => (
                <div
                  key={row.teamId}
                  className={`flex items-center justify-between px-6 py-3 text-sm ${myTeam && row.teamId === myTeam.id ? 'bg-brand-600/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink-2">
                      {idx + 1}
                    </span>
                    {idx < 5 && <Icon name="trophy" className="h-4 w-4 text-gold" />}
                    <span className="text-ink-1">{row.name} <span className="text-ink-3">({row.memberCount} member{row.memberCount === 1 ? '' : 's'})</span></span>
                  </div>
                  <span className="stat-figure text-ink-2">{row.solvedCount} solved</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {leaderboard.map((row, idx) => (
                <div
                  key={row.userId}
                  className={`flex items-center justify-between px-6 py-3 text-sm ${row.userId === currentUserId ? 'bg-brand-600/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink-2">
                      {idx + 1}
                    </span>
                    {idx < 5 && <Icon name="trophy" className="h-4 w-4 text-gold" />}
                    <span className="text-ink-1">{row.name}{row.userId === currentUserId ? ' (you)' : ''}</span>
                  </div>
                  <span className="stat-figure text-ink-2">{row.solvedCount} solved</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekendContestPage;
