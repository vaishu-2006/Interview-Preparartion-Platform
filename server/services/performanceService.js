const CodingAttempt = require('../models/CodingAttempt');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const InterviewSession = require('../models/InterviewSession');
const Profile = require('../models/Profile');
const UpscAttempt = require('../models/UpscAttempt');
const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const getPerformanceOverview = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (profile?.course === 'UPSC') {
    return getUpscPerformanceOverview(userId);
  }

  const [codingAttempts, aptitudeAttempts, interviewSessions] = await Promise.all([
    CodingAttempt.find({ userId, mode: 'submit' }).populate('questionId', 'difficulty').sort({ createdAt: 1 }),
    AptitudeAttempt.find({ userId }).sort({ createdAt: 1 }),
    InterviewSession.find({ userId }).sort({ createdAt: 1 }),
  ]);

  // Coding progress: cumulative unique solved count over time
  const solvedSoFar = new Set();
  const codingProgress = [];
  codingAttempts.forEach((a) => {
    if (a.status === 'Accepted' && a.questionId) solvedSoFar.add(String(a.questionId._id));
    codingProgress.push({ date: dayKey(a.createdAt), solvedCount: solvedSoFar.size });
  });

  // Aptitude progress: score percentage per attempt over time
  const aptitudeProgress = aptitudeAttempts.map((a) => ({
    date: dayKey(a.createdAt),
    scorePercent: a.totalQuestions ? Math.round((a.score / a.totalQuestions) * 100) : 0,
    category: a.category,
  }));

  // Interview attempts: count by status
  const interviewByStatus = interviewSessions.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    { pending: 0, in_progress: 0, completed: 0 }
  );

  // Overall activity: count of all activity events per day, last 14 days
  const activityMap = new Map();
  [...codingAttempts, ...aptitudeAttempts, ...interviewSessions].forEach((item) => {
    const key = dayKey(item.createdAt);
    activityMap.set(key, (activityMap.get(key) || 0) + 1);
  });
  const overallActivity = [...activityMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14);

  const { suggestions: weakAreas, weakTopic } = buildWeakAreaSuggestions(codingAttempts, aptitudeAttempts);

  return { codingProgress, aptitudeProgress, interviewByStatus, overallActivity, weakAreas, weakTopic };
};

// Heuristic, not AI-generated: lowest-average aptitude category and lowest-acceptance-rate
// coding difficulty tier among what the user has actually attempted, phrased as plain
// suggestions. No suggestion is produced for a dimension with no attempts yet. `weakTopic` is
// the single clearest weak-category name (aptitude category takes priority over a coding
// difficulty tier, since "practice more Medium problems" isn't a topic an AI can target) —
// used to power the "Generate AI Practice" button without the client having to parse strings.
const buildWeakAreaSuggestions = (codingAttempts, aptitudeAttempts) => {
  const suggestions = [];
  let weakTopic = null;

  const categoryTotals = {};
  aptitudeAttempts.forEach((a) => {
    if (!categoryTotals[a.category]) categoryTotals[a.category] = { sum: 0, count: 0 };
    categoryTotals[a.category].sum += a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0;
    categoryTotals[a.category].count += 1;
  });
  const categoryAverages = Object.entries(categoryTotals).map(([category, { sum, count }]) => ({
    category,
    avg: sum / count,
  }));
  if (categoryAverages.length) {
    const weakest = [...categoryAverages].sort((a, b) => a.avg - b.avg)[0];
    suggestions.push(
      `Your weakest aptitude category is ${weakest.category} (avg ${Math.round(weakest.avg)}%) — spend more practice time there.`
    );
    weakTopic = weakest.category;
  }

  const difficultyTotals = {};
  codingAttempts.forEach((a) => {
    const difficulty = a.questionId?.difficulty;
    if (!difficulty) return;
    if (!difficultyTotals[difficulty]) difficultyTotals[difficulty] = { accepted: 0, total: 0 };
    difficultyTotals[difficulty].total += 1;
    if (a.status === 'Accepted') difficultyTotals[difficulty].accepted += 1;
  });
  const difficultyRates = Object.entries(difficultyTotals).map(([difficulty, { accepted, total }]) => ({
    difficulty,
    rate: total ? (accepted / total) * 100 : 0,
  }));
  if (difficultyRates.length) {
    const weakest = [...difficultyRates].sort((a, b) => a.rate - b.rate)[0];
    suggestions.push(
      `${weakest.difficulty} coding problems have your lowest acceptance rate (${Math.round(weakest.rate)}%) — revisit fundamentals for that tier.`
    );
  }

  if (!suggestions.length) {
    suggestions.push('Not enough activity yet to identify a weak area — keep practicing and check back here.');
  }
  return { suggestions, weakTopic };
};

// UPSC has no coding/aptitude module, so its overview is driven by mock-test score
// progress and answer-writing activity instead — mirrors dashboardService's course branch.
const getUpscPerformanceOverview = async (userId) => {
  const [upscAttempts, answerWritingAttempts] = await Promise.all([
    UpscAttempt.find({ userId }).sort({ createdAt: 1 }),
    AnswerWritingAttempt.find({ userId }).sort({ createdAt: 1 }),
  ]);

  const upscProgress = upscAttempts.map((a) => ({
    date: dayKey(a.createdAt),
    scorePercent: a.totalQuestions ? Math.round((a.score / a.totalQuestions) * 100) : 0,
  }));

  const answerWritingProgress = answerWritingAttempts.map((a) => ({
    date: dayKey(a.createdAt),
    score: a.score,
  }));

  const activityMap = new Map();
  [...upscAttempts, ...answerWritingAttempts].forEach((item) => {
    const key = dayKey(item.createdAt);
    activityMap.set(key, (activityMap.get(key) || 0) + 1);
  });
  const overallActivity = [...activityMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14);

  const { suggestions: weakAreas, weakTopic } = await buildUpscWeakAreaSuggestions(userId);

  return { course: 'UPSC', upscProgress, answerWritingProgress, overallActivity, weakAreas, weakTopic };
};

// Weakest UPSC GS category by accuracy across the user's full answer history — real data
// joined from UpscQuestion, not fabricated.
const buildUpscWeakAreaSuggestions = async (userId) => {
  const rows = await UpscAttempt.aggregate([
    { $match: { userId } },
    { $unwind: '$answers' },
    { $lookup: { from: 'upscquestions', localField: 'answers.questionId', foreignField: '_id', as: 'q' } },
    { $unwind: '$q' },
    {
      $group: {
        _id: '$q.category',
        correct: { $sum: { $cond: ['$answers.isCorrect', 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);
  if (!rows.length) {
    return { suggestions: ['Not enough activity yet to identify a weak area — keep practicing and check back here.'], weakTopic: null };
  }
  const withPercent = rows.map((r) => ({ category: r._id, percent: r.total ? (r.correct / r.total) * 100 : 0 }));
  const weakest = [...withPercent].sort((a, b) => a.percent - b.percent)[0];
  return {
    suggestions: [`Your weakest UPSC category is ${weakest.category} (avg ${Math.round(weakest.percent)}%) — spend more revision time there.`],
    weakTopic: weakest.category,
  };
};

module.exports = { getPerformanceOverview };
