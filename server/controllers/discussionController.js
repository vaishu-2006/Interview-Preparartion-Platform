const asyncHandler = require('../utils/asyncHandler');
const discussionService = require('../services/discussionService');

const listComments = asyncHandler(async (req, res) => {
  const comments = await discussionService.listComments(req.params.slug);
  res.status(200).json({ success: true, comments });
});

const createComment = asyncHandler(async (req, res) => {
  const comment = await discussionService.createComment(req.user._id, req.user.name, req.params.slug, req.body.body);
  res.status(201).json({ success: true, comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  await discussionService.deleteComment(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Comment removed' });
});

module.exports = { listComments, createComment, deleteComment };
