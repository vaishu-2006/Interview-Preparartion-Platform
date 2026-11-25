const ProblemRating = require('../models/ProblemRating');
const CodingQuestion = require('../models/CodingQuestion');
const ApiError = require('../utils/ApiError');

const DIFFICULTY_PERCEPTIONS = ['Too Easy', 'Just Right', 'Too Hard'];

const resolveProblemId = async (slug) => {
  const question = await CodingQuestion.findOne({ slug }).select('_id');
  if (!question) throw new ApiError(404, 'Problem not found');
  return question._id;
};

const getSummary = async (questionId) => {
  const [qualityAgg, difficultyAgg] = await Promise.all([
    ProblemRating.aggregate([
      { $match: { questionId } },
      { $group: { _id: null, avgQuality: { $avg: '$qualityRating' }, count: { $sum: 1 } } },
    ]),
    ProblemRating.aggregate([{ $match: { questionId } }, { $group: { _id: '$difficultyPerception', count: { $sum: 1 } } }]),
  ]);
  const difficultyBreakdown = DIFFICULTY_PERCEPTIONS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
  difficultyAgg.forEach((row) => {
    difficultyBreakdown[row._id] = row.count;
  });
  return {
    avgQuality: qualityAgg[0] ? Math.round(qualityAgg[0].avgQuality * 10) / 10 : null,
    ratingCount: qualityAgg[0]?.count || 0,
    difficultyBreakdown,
  };
};

const getRatings = async (userId, slug) => {
  const problemId = await resolveProblemId(slug);
  const [summary, mine] = await Promise.all([
    getSummary(problemId),
    ProblemRating.findOne({ userId, questionId: problemId }).select('qualityRating difficultyPerception'),
  ]);
  return { summary, myRating: mine ? { qualityRating: mine.qualityRating, difficultyPerception: mine.difficultyPerception } : null };
};

const rateProblem = async (userId, slug, { qualityRating, difficultyPerception }) => {
  if (!Number.isInteger(qualityRating) || qualityRating < 1 || qualityRating > 5) {
    throw new ApiError(422, 'qualityRating must be an integer 1-5');
  }
  if (!DIFFICULTY_PERCEPTIONS.includes(difficultyPerception)) {
    throw new ApiError(422, 'difficultyPerception must be one of Too Easy, Just Right, Too Hard');
  }
  const problemId = await resolveProblemId(slug);
  await ProblemRating.findOneAndUpdate({ userId, questionId: problemId }, { qualityRating, difficultyPerception }, { upsert: true });
  return getRatings(userId, slug);
};

// Bulk summaries for a list of problems (used on the coding list page) — one aggregate query,
// not N+1 per row.
const getSummariesForQuestionIds = async (questionIds) => {
  const rows = await ProblemRating.aggregate([
    { $match: { questionId: { $in: questionIds } } },
    { $group: { _id: '$questionId', avgQuality: { $avg: '$qualityRating' }, count: { $sum: 1 } } },
  ]);
  const map = new Map();
  rows.forEach((r) => map.set(String(r._id), { avgQuality: Math.round(r.avgQuality * 10) / 10, ratingCount: r.count }));
  return map;
};

module.exports = { getRatings, rateProblem, getSummariesForQuestionIds };
