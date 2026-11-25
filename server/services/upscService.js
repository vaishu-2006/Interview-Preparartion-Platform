const UpscQuestion = require('../models/UpscQuestion');
const UpscAttempt = require('../models/UpscAttempt');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');
const seededPick = require('../utils/seededPick');

const DAILY_QUIZ_SIZE = 10;

const POINTS_PER_ATTEMPT = 5;
// Platform practice bar for unlocking Mains — not a claim about a real UPSC cutoff (those vary
// by year/category and aren't published as a single number), just this app's own gate.
const PASS_PERCENT = 40;

const percentFor = (a) => (a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0);

const hasPrelimsCleared = async (userId) => {
  const prelimsAttempts = await UpscAttempt.find({ userId, stage: 'Prelims' });
  return prelimsAttempts.some((a) => percentFor(a) >= PASS_PERCENT);
};

// Mains pulls a harder mix (Medium/Hard only) — the real differentiator we actually have data
// for, since this platform's UPSC bank is MCQ-based and doesn't fabricate a separate
// Prelims-vs-Mains question set (Mains-style subjective writing is covered by Answer Writing).
const getQuiz = async (limit = 20, stage = 'Prelims') => {
  if (stage === 'Daily') return getDailyQuiz();

  const match = stage === 'Mains' ? [{ $match: { difficulty: { $in: ['Medium', 'Hard'] } } }] : [];
  return UpscQuestion.aggregate([
    ...match,
    { $sample: { size: Number(limit) } },
    { $project: { question: 1, options: 1, category: 1, difficulty: 1 } },
  ]);
};

// A short daily set from the real Current Affairs category, deterministically picked by
// today's date — everyone gets the same 10 questions on a given day, and they rotate
// tomorrow. Falls back to the whole bank if there aren't enough Current Affairs questions yet.
const getDailyQuiz = async () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  let pool = await UpscQuestion.find({ category: 'Current Affairs' }).select('question options category difficulty');
  if (pool.length < DAILY_QUIZ_SIZE) {
    pool = await UpscQuestion.find().select('question options category difficulty');
  }
  return seededPick(pool, todayKey, Math.min(DAILY_QUIZ_SIZE, pool.length));
};

const submitAttempt = async (userId, { answers, timeTakenSeconds, confidenceScore, stage }) => {
  if (!Array.isArray(answers) || !answers.length) {
    throw new ApiError(422, 'At least one answer is required');
  }
  const resolvedStage = stage === 'Mains' ? 'Mains' : stage === 'Daily' ? 'Daily' : 'Prelims';
  if (resolvedStage === 'Mains' && !(await hasPrelimsCleared(userId))) {
    throw new ApiError(403, `Clear a Prelims mock test (score ${PASS_PERCENT}%+) first to unlock Mains.`);
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await UpscQuestion.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let score = 0;
  const gradedAnswers = answers.map(({ questionId, selectedOptionIndex }) => {
    const question = questionMap.get(String(questionId));
    const isCorrect = Boolean(question) && question.correctOptionIndex === selectedOptionIndex;
    if (isCorrect) score += 1;
    return { questionId, selectedOptionIndex, isCorrect };
  });

  const attempt = await UpscAttempt.create({
    userId,
    stage: resolvedStage,
    answers: gradedAnswers,
    score,
    totalQuestions: answers.length,
    timeTakenSeconds: timeTakenSeconds || 0,
    confidenceScore: confidenceScore ?? null,
  });
  await awardPoints(userId, POINTS_PER_ATTEMPT);

  const review = answers.map(({ questionId, selectedOptionIndex }) => {
    const question = questionMap.get(String(questionId));
    return {
      questionId,
      question: question?.question,
      options: question?.options,
      correctOptionIndex: question?.correctOptionIndex,
      selectedOptionIndex,
      explanation: question?.explanation,
      category: question?.category,
      isCorrect: question?.correctOptionIndex === selectedOptionIndex,
    };
  });

  return {
    attemptId: attempt._id,
    stage: resolvedStage,
    score,
    totalQuestions: answers.length,
    review,
    confidenceScore: attempt.confidenceScore,
  };
};

const getStats = async (userId) => {
  const attempts = await UpscAttempt.find({ userId }).sort({ createdAt: -1 });
  const prelimsAttempts = attempts.filter((a) => a.stage === 'Prelims');
  const mainsAttempts = attempts.filter((a) => a.stage === 'Mains');
  const dailyAttempts = attempts.filter((a) => a.stage === 'Daily');
  const prelimsCleared = prelimsAttempts.some((a) => percentFor(a) >= PASS_PERCENT);
  const todayKey = new Date().toISOString().slice(0, 10);
  const dailyCompletedToday = dailyAttempts.some((a) => a.createdAt.toISOString().slice(0, 10) === todayKey);

  if (!attempts.length) {
    return {
      totalTests: 0,
      averageScorePercent: 0,
      prelimsCleared: false,
      prelimsAttempts: 0,
      mainsAttempts: 0,
      dailyAttempts: 0,
      dailyCompletedToday: false,
      passPercent: PASS_PERCENT,
      recentAttempts: [],
    };
  }
  const averageScorePercent = Math.round(attempts.reduce((sum, a) => sum + percentFor(a), 0) / attempts.length);
  return {
    totalTests: attempts.length,
    averageScorePercent,
    prelimsCleared,
    prelimsAttempts: prelimsAttempts.length,
    mainsAttempts: mainsAttempts.length,
    dailyAttempts: dailyAttempts.length,
    dailyCompletedToday,
    passPercent: PASS_PERCENT,
    recentAttempts: attempts.slice(0, 5).map((a) => ({
      id: a._id,
      stage: a.stage,
      score: a.score,
      totalQuestions: a.totalQuestions,
      createdAt: a.createdAt,
    })),
  };
};

// Ranks users by average mock-test score percent (min 2 attempts, so a single lucky
// attempt doesn't dominate) — real data from UpscAttempt, no fabricated entries.
const getRanking = async () => {
  const rows = await UpscAttempt.aggregate([
    {
      $group: {
        _id: '$userId',
        attempts: { $sum: 1 },
        avgPercent: { $avg: { $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100] } },
      },
    },
    { $match: { attempts: { $gte: 2 } } },
    { $sort: { avgPercent: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', name: '$user.name', attempts: 1, averageScorePercent: { $round: ['$avgPercent', 0] } } },
  ]);
  return rows;
};

module.exports = { getQuiz, submitAttempt, getStats, getRanking };
