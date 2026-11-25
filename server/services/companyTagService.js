const CompanyTag = require('../models/CompanyTag');
const CodingQuestion = require('../models/CodingQuestion');
const ApiError = require('../utils/ApiError');

const resolveProblemId = async (slug) => {
  const question = await CodingQuestion.findOne({ slug }).select('_id');
  if (!question) throw new ApiError(404, 'Problem not found');
  return question._id;
};

const ROUND_TYPES = ['OA', 'Tech-1', 'Tech-2', 'HR', 'Other'];

const listTags = async (slug) => {
  const problemId = await resolveProblemId(slug);
  const rows = await CompanyTag.aggregate([
    { $match: { problemId } },
    { $group: { _id: { company: '$company', roundType: '$roundType' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, company: '$_id.company', roundType: '$_id.roundType', count: 1 } },
  ]);
  return rows;
};

const addTag = async (userId, slug, company, roundType) => {
  if (!company?.trim()) {
    throw new ApiError(422, 'company is required');
  }
  const resolvedRoundType = ROUND_TYPES.includes(roundType) ? roundType : 'Other';
  const problemId = await resolveProblemId(slug);
  try {
    await CompanyTag.create({ problemId, userId, company: company.trim(), roundType: resolvedRoundType });
  } catch (err) {
    if (err.code !== 11000) throw err; // duplicate tag from the same user — silently no-op
  }
  return listTags(slug);
};

module.exports = { listTags, addTag, ROUND_TYPES };
