const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const codingService = require('../services/codingService');
const problemRatingService = require('../services/problemRatingService');
const { LANGUAGE_IDS } = require('../services/judge0Service');
const Profile = require('../models/Profile');

const listProblems = asyncHandler(async (req, res) => {
  const problems = await codingService.listProblems({ ...req.query, userId: req.user._id });
  res.status(200).json({ success: true, problems, languages: Object.keys(LANGUAGE_IDS) });
});

const getProblem = asyncHandler(async (req, res) => {
  const problem = await codingService.getProblemBySlug(req.params.slug);
  res.status(200).json({ success: true, problem });
});

const runCode = asyncHandler(async (req, res) => {
  const { language, code, customInput } = req.body;
  if (!language || !code) {
    throw new ApiError(422, 'language and code are required');
  }
  const result = await codingService.runCode({ slug: req.params.slug, language, code, customInput });
  res.status(200).json({ success: true, result });
});

const submitCode = asyncHandler(async (req, res) => {
  const { language, code, confidenceScore, contestId } = req.body;
  if (!language || !code) {
    throw new ApiError(422, 'language and code are required');
  }
  const result = await codingService.submitCode(req.user._id, { slug: req.params.slug, language, code, confidenceScore, contestId });
  res.status(201).json({ success: true, ...result });
});

const getHistory = asyncHandler(async (req, res) => {
  const attempts = await codingService.getUserHistory(req.user._id);
  res.status(200).json({ success: true, attempts });
});

const getProgress = asyncHandler(async (req, res) => {
  const progress = await codingService.getUserProgress(req.user._id);
  res.status(200).json({ success: true, progress });
});

const reviewCode = asyncHandler(async (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) {
    throw new ApiError(422, 'language and code are required');
  }
  const review = await codingService.reviewCode(req.user._id, { slug: req.params.slug, language, code });
  res.status(200).json({ success: true, ...review });
});

const explainFailure = asyncHandler(async (req, res) => {
  const { language, code, input, expectedOutput, actualOutput } = req.body;
  if (!language || !code) {
    throw new ApiError(422, 'language and code are required');
  }
  const explanation = await codingService.explainFailure(req.user._id, {
    slug: req.params.slug,
    language,
    code,
    input,
    expectedOutput,
    actualOutput,
  });
  res.status(200).json({ success: true, ...explanation });
});

const getLeaderboard = asyncHandler(async (req, res) => {
  let college;
  if (req.query.scope === 'college') {
    const profile = await Profile.findOne({ userId: req.user._id }).select('college');
    college = profile?.college || undefined;
  }
  const leaderboard = await codingService.getLeaderboard({ college });
  res.status(200).json({ success: true, leaderboard, scopedToCollege: college || null });
});

const getDailyChallenge = asyncHandler(async (req, res) => {
  const daily = await codingService.getDailyChallenge(req.user._id);
  res.status(200).json({ success: true, ...daily });
});

const getRatings = asyncHandler(async (req, res) => {
  const data = await problemRatingService.getRatings(req.user._id, req.params.slug);
  res.status(200).json({ success: true, ...data });
});

const rateProblem = asyncHandler(async (req, res) => {
  const data = await problemRatingService.rateProblem(req.user._id, req.params.slug, req.body);
  res.status(200).json({ success: true, ...data });
});

module.exports = {
  listProblems,
  getProblem,
  runCode,
  submitCode,
  getHistory,
  getProgress,
  reviewCode,
  explainFailure,
  getLeaderboard,
  getDailyChallenge,
  getRatings,
  rateProblem,
};
