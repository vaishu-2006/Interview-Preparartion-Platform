const AptitudeQuestion = require('../models/AptitudeQuestion');
const AptitudeAttempt = require('../models/AptitudeAttempt');
const ApiError = require('../utils/ApiError');
const awardPoints = require('../utils/awardPoints');

const POINTS_PER_ATTEMPT = 5;

const CATEGORIES = ['Numerical', 'Logical', 'Verbal', 'Non-Verbal'];

const getQuestionsForQuiz = async (category, limit = 10) => {
  if (!CATEGORIES.includes(category)) {
    throw new ApiError(422, `Category must be one of: ${CATEGORIES.join(', ')}`);
  }
  const questions = await AptitudeQuestion.aggregate([
    { $match: { category } },
    { $sample: { size: Number(limit) } },
    { $project: { question: 1, options: 1, category: 1, difficulty: 1 } },
  ]);
  return questions;
};

const submitAttempt = async (userId, { category, answers, timeTakenSeconds, confidenceScore }) => {
  if (!CATEGORIES.includes(category)) {
    throw new ApiError(422, `Category must be one of: ${CATEGORIES.join(', ')}`);
  }
  if (!Array.isArray(answers) || !answers.length) {
    throw new ApiError(422, 'At least one answer is required');
  }

  const questionIds = answers.map((a) => a.questionId);
  const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  let score = 0;
  const gradedAnswers = answers.map(({ questionId, selectedOptionIndex }) => {
    const question = questionMap.get(String(questionId));
    const isCorrect = Boolean(question) && question.correctOptionIndex === selectedOptionIndex;
    if (isCorrect) score += 1;
    return { questionId, selectedOptionIndex, isCorrect };
  });

  const attempt = await AptitudeAttempt.create({
    userId,
    category,
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
      isCorrect: question?.correctOptionIndex === selectedOptionIndex,
    };
  });

  return { attemptId: attempt._id, score, totalQuestions: answers.length, review, confidenceScore: attempt.confidenceScore };
};

const getHistory = async (userId) => {
  const attempts = await AptitudeAttempt.find({ userId }).sort({ createdAt: -1 }).limit(50);
  return attempts;
};

const getStats = async (userId) => {
  const attempts = await AptitudeAttempt.find({ userId });
  if (!attempts.length) {
    return {
      totalTests: 0,
      highestScorePercent: 0,
      averageScorePercent: 0,
      categoryPerformance: CATEGORIES.map((category) => ({ category, attempts: 0, averageScorePercent: 0 })),
      recentAttempts: [],
    };
  }

  const percentFor = (a) => (a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0);
  const percentages = attempts.map(percentFor);
  const highestScorePercent = Math.round(Math.max(...percentages));
  const averageScorePercent = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);

  const categoryPerformance = CATEGORIES.map((category) => {
    const inCategory = attempts.filter((a) => a.category === category);
    if (!inCategory.length) return { category, attempts: 0, averageScorePercent: 0 };
    const avg = Math.round(inCategory.reduce((sum, a) => sum + percentFor(a), 0) / inCategory.length);
    return { category, attempts: inCategory.length, averageScorePercent: avg };
  });

  const recentAttempts = [...attempts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((a) => ({
      id: a._id,
      category: a.category,
      score: a.score,
      totalQuestions: a.totalQuestions,
      createdAt: a.createdAt,
    }));

  return { totalTests: attempts.length, highestScorePercent, averageScorePercent, categoryPerformance, recentAttempts };
};

module.exports = { CATEGORIES, getQuestionsForQuiz, submitAttempt, getHistory, getStats };
