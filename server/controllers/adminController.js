const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/adminService');
const codeSimilarityService = require('../services/codeSimilarityService');
const ApiError = require('../utils/ApiError');
const Profile = require('../models/Profile');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getPlatformStats();
  res.status(200).json({ success: true, stats });
});

const listStudents = asyncHandler(async (req, res) => {
  const { course, college } = req.query;
  const students = await adminService.listStudents({ course, college });
  res.status(200).json({ success: true, students });
});

const assignProblem = asyncHandler(async (req, res) => {
  const assignment = await adminService.assignProblem(req.user._id, req.body);
  res.status(201).json({ success: true, assignment });
});

const listMyAssignments = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const assignments = await adminService.listMyAssignments(req.user._id, profile?.course);
  res.status(200).json({ success: true, assignments });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await adminService.createEvent(req.user._id, req.body);
  res.status(201).json({ success: true, event });
});

const listEvents = asyncHandler(async (req, res) => {
  const events = await adminService.listEvents();
  res.status(200).json({ success: true, events });
});

const listActiveEvents = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const events = await adminService.listActiveEvents(profile?.course);
  res.status(200).json({ success: true, events });
});

const awardPoints = asyncHandler(async (req, res) => {
  const { userId, amount, reason } = req.body;
  await adminService.awardPointsToStudent(userId, Number(amount), reason);
  res.status(200).json({ success: true, message: 'Points awarded' });
});

const getCohortAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getCohortAnalytics(req.query.course);
  res.status(200).json({ success: true, analytics });
});

const checkCodeSimilarity = asyncHandler(async (req, res) => {
  const { slug } = req.query;
  if (!slug) throw new ApiError(422, 'slug is required');
  const result = await codeSimilarityService.checkSimilarity(slug);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  getStats,
  listStudents,
  assignProblem,
  listMyAssignments,
  createEvent,
  listEvents,
  listActiveEvents,
  awardPoints,
  getCohortAnalytics,
  checkCodeSimilarity,
};
