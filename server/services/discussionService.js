const Discussion = require('../models/Discussion');
const CodingQuestion = require('../models/CodingQuestion');
const ApiError = require('../utils/ApiError');

const resolveProblemId = async (slug) => {
  const question = await CodingQuestion.findOne({ slug }).select('_id');
  if (!question) {
    throw new ApiError(404, 'Problem not found');
  }
  return question._id;
};

const listComments = async (slug) => {
  const problemId = await resolveProblemId(slug);
  return Discussion.find({ problemId }).sort({ createdAt: -1 }).limit(200);
};

const createComment = async (userId, userName, slug, body) => {
  if (!body?.trim()) {
    throw new ApiError(422, 'Comment cannot be empty');
  }
  const problemId = await resolveProblemId(slug);
  return Discussion.create({ problemId, userId, userName, body: body.trim() });
};

const deleteComment = async (userId, id) => {
  const comment = await Discussion.findOneAndDelete({ _id: id, userId });
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }
};

module.exports = { listComments, createComment, deleteComment };
