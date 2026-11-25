const Bookmark = require('../models/Bookmark');
const ApiError = require('../utils/ApiError');

const listBookmarks = (userId) => Bookmark.find({ userId }).sort({ createdAt: -1 });

const createBookmark = async (userId, { label, href, category }) => {
  if (!label?.trim() || !href?.trim()) {
    throw new ApiError(422, 'label and href are required');
  }
  try {
    return await Bookmark.create({ userId, label: label.trim(), href: href.trim(), category: category || '' });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, 'This link is already bookmarked');
    }
    throw err;
  }
};

const deleteBookmark = async (userId, id) => {
  const bookmark = await Bookmark.findOneAndDelete({ _id: id, userId });
  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found');
  }
};

module.exports = { listBookmarks, createBookmark, deleteBookmark };
