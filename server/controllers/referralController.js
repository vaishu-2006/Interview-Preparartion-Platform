const asyncHandler = require('../utils/asyncHandler');
const referralService = require('../services/referralService');

const listPosts = asyncHandler(async (req, res) => {
  const posts = await referralService.listPosts();
  res.status(200).json({ success: true, posts });
});

const createPost = asyncHandler(async (req, res) => {
  const post = await referralService.createPost(req.user._id, req.user.name, req.body);
  res.status(201).json({ success: true, post });
});

const deletePost = asyncHandler(async (req, res) => {
  await referralService.deletePost(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Post removed' });
});

module.exports = { listPosts, createPost, deletePost };
