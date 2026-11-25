const asyncHandler = require('../utils/asyncHandler');
const bookmarkService = require('../services/bookmarkService');

const listBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.listBookmarks(req.user._id);
  res.status(200).json({ success: true, bookmarks });
});

const createBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.createBookmark(req.user._id, req.body);
  res.status(201).json({ success: true, bookmark });
});

const deleteBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.deleteBookmark(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Bookmark removed' });
});

module.exports = { listBookmarks, createBookmark, deleteBookmark };
