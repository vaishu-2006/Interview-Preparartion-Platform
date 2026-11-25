const crypto = require('crypto');
const Profile = require('../models/Profile');
const User = require('../models/User');
const achievementsService = require('./achievementsService');
const codingService = require('./codingService');
const upscService = require('./upscService');
const contestService = require('./contestService');
const ApiError = require('../utils/ApiError');

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'student';

const generateSlug = async (name) => {
  const base = slugify(name);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString('hex');
    const candidate = `${base}-${suffix}`;
    // eslint-disable-next-line no-await-in-loop
    if (!(await Profile.exists({ portfolioSlug: candidate }))) return candidate;
  }
  throw new ApiError(500, 'Could not generate a unique portfolio link, try again');
};

const getMySettings = async (userId) => {
  const profile = await Profile.findOne({ userId }).select('isPortfolioPublic portfolioSlug');
  return { isPublic: Boolean(profile?.isPortfolioPublic), slug: profile?.portfolioSlug || null };
};

const setPublic = async (userId, isPublic) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new ApiError(404, 'Complete your profile first');

  if (isPublic && !profile.portfolioSlug) {
    const user = await User.findById(userId).select('name');
    profile.portfolioSlug = await generateSlug(user?.name || 'student');
  }
  profile.isPortfolioPublic = Boolean(isPublic);
  await profile.save();
  return { isPublic: profile.isPortfolioPublic, slug: profile.portfolioSlug };
};

// Deliberately lean: name + course + real, already-recorded activity stats. No email, college,
// or other contact info — the whole point is a safe, opt-in-only public link.
const getPublicPortfolio = async (slug) => {
  const profile = await Profile.findOne({ portfolioSlug: slug, isPortfolioPublic: true });
  if (!profile) throw new ApiError(404, 'This portfolio is not available');

  const user = await User.findById(profile.userId).select('name');
  const achievements = await achievementsService.getAchievements(profile.userId);

  let courseStats = null;
  if (profile.course === 'UPSC') {
    const stats = await upscService.getStats(profile.userId);
    courseStats = {
      totalTests: stats.totalTests,
      averageScorePercent: stats.averageScorePercent,
      prelimsCleared: stats.prelimsCleared,
    };
  } else if (profile.course === 'BE' || profile.course === 'BCA') {
    const [progress, contestStats] = await Promise.all([
      codingService.getUserProgress(profile.userId),
      contestService.getMyContestStats(profile.userId),
    ]);
    courseStats = {
      solvedCount: progress.solvedCount,
      totalProblems: progress.totalProblems,
      currentStreak: progress.currentStreak,
      contestsParticipated: contestStats.contestsParticipated,
    };
  }

  return {
    name: user?.name || 'Student',
    course: profile.course,
    branch: profile.branch,
    level: achievements.level,
    levelTitle: achievements.title,
    points: achievements.points,
    badges: achievements.badges.filter((b) => b.unlocked),
    totalBadges: achievements.totalBadges,
    unlockedCount: achievements.unlockedCount,
    courseStats,
  };
};

module.exports = { getMySettings, setPublic, getPublicPortfolio };
