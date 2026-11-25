const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const CodingQuestion = require('../models/CodingQuestion');
const CodingAttempt = require('../models/CodingAttempt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const seededPick = require('../utils/seededPick');

const PROBLEM_SPREAD = { Easy: 2, Medium: 2, Hard: 1 };
const CONTEST_BONUS_POINTS = 15;

// The contest window is Saturday 00:00 to Sunday 23:59:59, server-local time. On a weekday,
// this resolves to the *upcoming* weekend so the page can show a countdown; on Sat/Sun it
// resolves to the weekend currently in progress.
const weekendWindow = (now = new Date()) => {
  const day = now.getDay(); // 0=Sun..6=Sat
  let daysUntilSaturday;
  if (day === 6) daysUntilSaturday = 0;
  else if (day === 0) daysUntilSaturday = -1;
  else daysUntilSaturday = 6 - day;

  const startsAt = new Date(now);
  startsAt.setHours(0, 0, 0, 0);
  startsAt.setDate(startsAt.getDate() + daysUntilSaturday);

  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 1);
  endsAt.setHours(23, 59, 59, 999);

  return { startsAt, endsAt };
};

const getOrCreateCurrentContest = async () => {
  const { startsAt, endsAt } = weekendWindow();
  const weekKey = startsAt.toISOString().slice(0, 10);

  let contest = await Contest.findOne({ weekKey });
  if (contest) return contest;

  const byDifficulty = await Promise.all(
    Object.keys(PROBLEM_SPREAD).map((difficulty) => CodingQuestion.find({ difficulty }).select('_id'))
  );

  const problemIds = Object.keys(PROBLEM_SPREAD).flatMap((difficulty, idx) =>
    seededPick(byDifficulty[idx], `${weekKey}-${difficulty}`, PROBLEM_SPREAD[difficulty]).map((q) => q._id)
  );

  try {
    contest = await Contest.create({ weekKey, startsAt, endsAt, problemIds });
  } catch (err) {
    // Race: another request created it first between the findOne and create above.
    contest = await Contest.findOne({ weekKey });
    if (!contest) throw err;
  }
  return contest;
};

const getCurrentContest = async (userId) => {
  const contest = await Contest.findOne().sort({ startsAt: -1 }).exec();
  const current = contest && contest.endsAt >= new Date() ? contest : await getOrCreateCurrentContest();

  const [problems, solvedAttempts] = await Promise.all([
    CodingQuestion.find({ _id: { $in: current.problemIds } }).select('title slug difficulty'),
    CodingAttempt.find({ userId, contestId: current._id, status: 'Accepted' }).select('questionId'),
  ]);

  const solvedIds = new Set(solvedAttempts.map((a) => String(a.questionId)));
  const now = new Date();

  return {
    id: current._id,
    startsAt: current.startsAt,
    endsAt: current.endsAt,
    isLive: now >= current.startsAt && now <= current.endsAt,
    bonusPointsPerSolve: CONTEST_BONUS_POINTS,
    problems: current.problemIds
      .map((id) => problems.find((p) => String(p._id) === String(id)))
      .filter(Boolean)
      .map((p) => ({ title: p.title, slug: p.slug, difficulty: p.difficulty, solved: solvedIds.has(String(p._id)) })),
    solvedCount: solvedIds.size,
  };
};

// Ranks contest entrants by distinct contest problems solved, tie-broken by earliest final
// solve time (faster finisher ranks higher) — real data from CodingAttempt, top 20.
// Optional `college` scopes the board to entrants sharing that exact Profile.college value.
const getLeaderboard = async (contestId, { college } = {}) => {
  const pipeline = [
    { $match: { contestId: new mongoose.Types.ObjectId(contestId), status: 'Accepted' } },
    { $sort: { createdAt: 1 } },
    { $group: { _id: { userId: '$userId', questionId: '$questionId' }, solvedAt: { $first: '$createdAt' } } },
    { $group: { _id: '$_id.userId', solvedCount: { $sum: 1 }, lastSolvedAt: { $max: '$solvedAt' } } },
  ];
  if (college) {
    pipeline.push(
      { $lookup: { from: 'profiles', localField: '_id', foreignField: 'userId', as: 'profile' } },
      { $unwind: '$profile' },
      { $match: { 'profile.college': college } }
    );
  }
  pipeline.push(
    { $sort: { solvedCount: -1, lastSolvedAt: 1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', name: '$user.name', solvedCount: 1, lastSolvedAt: 1 } }
  );
  return CodingAttempt.aggregate(pipeline);
};

// Real, computed-from-attempts participation stats — distinct weekend contests the user has
// solved at least one problem in, and the current run of consecutive weekends (walking back
// from this week/the most recently completed one). No fabricated rating, just real counts.
const getMyContestStats = async (userId) => {
  const rows = await CodingAttempt.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), contestId: { $ne: null }, status: 'Accepted' } },
    { $group: { _id: '$contestId' } },
    { $lookup: { from: 'contests', localField: '_id', foreignField: '_id', as: 'contest' } },
    { $unwind: '$contest' },
    { $project: { _id: 0, weekKey: '$contest.weekKey' } },
  ]);
  const weekKeys = new Set(rows.map((r) => r.weekKey));

  let cursor = weekendWindow().startsAt;
  let cursorKey = cursor.toISOString().slice(0, 10);
  if (!weekKeys.has(cursorKey)) {
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 7);
    cursorKey = cursor.toISOString().slice(0, 10);
  }
  let streak = 0;
  const step = new Date(cursorKey);
  while (weekKeys.has(step.toISOString().slice(0, 10))) {
    streak += 1;
    step.setDate(step.getDate() - 7);
  }

  return { contestsParticipated: weekKeys.size, currentStreak: streak };
};

// The most recently CLOSED weekend contest, if any — separate from getCurrentContest, which
// always resolves to the live-or-upcoming one. This is what the certificate flow needs: a
// contest whose leaderboard is actually final.
const getPreviousContest = async () => {
  const contest = await Contest.findOne({ endsAt: { $lt: new Date() } }).sort({ endsAt: -1 });
  if (!contest) return null;
  return { id: contest._id, startsAt: contest.startsAt, endsAt: contest.endsAt, problemCount: contest.problemIds.length };
};

// Certificates are only issued for a CLOSED contest (endsAt in the past — the leaderboard is
// final) and only to entrants who actually placed top 5 on the real, unscoped leaderboard.
// Nothing here is generated speculatively for an ongoing contest.
const getCertificateEligibility = async (userId, contestId) => {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new ApiError(404, 'Contest not found');
  if (contest.endsAt >= new Date()) {
    throw new ApiError(403, 'Certificates are only available once a contest has ended');
  }
  const leaderboard = await getLeaderboard(contestId);
  const rankIndex = leaderboard.findIndex((row) => String(row.userId) === String(userId));
  if (rankIndex === -1 || rankIndex >= 5) {
    throw new ApiError(403, 'Only the top 5 finishers of this contest can download a certificate');
  }
  const user = await User.findById(userId).select('name');
  return {
    name: user.name,
    rank: rankIndex + 1,
    solvedCount: leaderboard[rankIndex].solvedCount,
    totalProblems: contest.problemIds.length,
    weekLabel: contest.startsAt.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
  };
};

module.exports = {
  getCurrentContest,
  getLeaderboard,
  getMyContestStats,
  getCertificateEligibility,
  getPreviousContest,
  weekendWindow,
};
