const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const upscService = require('../services/upscService');
const answerWritingService = require('../services/answerWritingService');
const aiService = require('../services/aiService');
const newsService = require('../services/newsService');

const getQuiz = asyncHandler(async (req, res) => {
  const questions = await upscService.getQuiz(req.query.limit ? Number(req.query.limit) : 20, req.query.stage);
  res.status(200).json({ success: true, questions });
});

const submitQuiz = asyncHandler(async (req, res) => {
  const result = await upscService.submitAttempt(req.user._id, req.body);
  res.status(201).json({ success: true, ...result });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await upscService.getStats(req.user._id);
  res.status(200).json({ success: true, stats });
});

const getRanking = asyncHandler(async (req, res) => {
  const ranking = await upscService.getRanking();
  res.status(200).json({ success: true, ranking });
});

const submitAnswerWriting = asyncHandler(async (req, res) => {
  const attempt = await answerWritingService.submitAnswer(req.user._id, req.body);
  res.status(201).json({ success: true, attempt });
});

const getAnswerWritingHistory = asyncHandler(async (req, res) => {
  const attempts = await answerWritingService.getHistory(req.user._id);
  res.status(200).json({ success: true, attempts });
});

const askDoubt = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) {
    throw new ApiError(422, 'question is required');
  }
  const result = await aiService.solveDoubt({ question });
  res.status(200).json({ success: true, ...result });
});

const getLiveCurrentAffairs = asyncHandler(async (req, res) => {
  const data = await newsService.getLiveCurrentAffairs();
  res.status(200).json({ success: true, ...data });
});

module.exports = {
  getQuiz,
  submitQuiz,
  getStats,
  getRanking,
  submitAnswerWriting,
  getAnswerWritingHistory,
  askDoubt,
  getLiveCurrentAffairs,
};
