const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const subjectService = require('../services/subjectService');

const getSubjects = asyncHandler(async (req, res) => {
  const { course } = req.query;
  if (!course) throw new ApiError(422, 'course is required');
  res.status(200).json({ success: true, subjects: subjectService.SUBJECTS_BY_COURSE[course] || [] });
});

const getQuiz = asyncHandler(async (req, res) => {
  const { course, subject, limit } = req.query;
  if (!course || !subject) throw new ApiError(422, 'course and subject are required');
  const questions = await subjectService.getQuestionsForQuiz(course, subject, limit ? Number(limit) : 10);
  res.status(200).json({ success: true, questions });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const result = await subjectService.submitAttempt(req.user._id, req.body);
  res.status(201).json({ success: true, ...result });
});

const getStats = asyncHandler(async (req, res) => {
  const { course } = req.query;
  if (!course) throw new ApiError(422, 'course is required');
  const stats = await subjectService.getStats(req.user._id, course);
  res.status(200).json({ success: true, stats });
});

module.exports = { getSubjects, getQuiz, submitAttempt, getStats };
