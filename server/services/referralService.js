const ReferralPost = require('../models/ReferralPost');
const ApiError = require('../utils/ApiError');

const TYPES = ['offering', 'seeking'];

const listPosts = () => ReferralPost.find().sort({ createdAt: -1 }).limit(100);

const createPost = async (userId, userName, { type, company, role, message, contact }) => {
  if (!TYPES.includes(type)) {
    throw new ApiError(422, `type must be one of: ${TYPES.join(', ')}`);
  }
  if (!company?.trim() || !message?.trim()) {
    throw new ApiError(422, 'company and message are required');
  }
  return ReferralPost.create({
    userId,
    userName,
    type,
    company: company.trim(),
    role: role || '',
    message: message.trim(),
    contact: contact || '',
  });
};

const deletePost = async (userId, id) => {
  const post = await ReferralPost.findOneAndDelete({ _id: id, userId });
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
};

module.exports = { listPosts, createPost, deletePost };
