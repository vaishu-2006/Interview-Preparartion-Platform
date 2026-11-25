const asyncHandler = require('../utils/asyncHandler');
const aptitudeService = require('../services/aptitudeService');
const aiService = require('../services/aiService');
const Profile = require('../models/Profile');
const ApiError = require('../utils/ApiError');

const getCategories = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, categories: aptitudeService.CATEGORIES });
});

const getQuiz = asyncHandler(async (req, res) => {
  const { category, limit } = req.query;
  const questions = await aptitudeService.getQuestionsForQuiz(category, limit);
  res.status(200).json({ success: true, questions });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const result = await aptitudeService.submitAttempt(req.user._id, req.body);
  res.status(201).json({ success: true, ...result });
});

const getHistory = asyncHandler(async (req, res) => {
  const attempts = await aptitudeService.getHistory(req.user._id);
  res.status(200).json({ success: true, attempts });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await aptitudeService.getStats(req.user._id);
  res.status(200).json({ success: true, stats });
});

const practiceMore = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic?.trim()) {
    throw new ApiError(422, 'topic is required');
  }
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const result = await aiService.generatePracticeMcqs({ topic, course: profile?.course, count: 5 });
  res.status(200).json({ success: true, ...result });
});

module.exports = { getCategories, getQuiz, submitAttempt, getHistory, getStats, practiceMore };
