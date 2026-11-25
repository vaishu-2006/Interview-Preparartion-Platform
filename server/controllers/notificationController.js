const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

const list = asyncHandler(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    notificationService.listForUser(req.user._id),
    notificationService.unreadCount(req.user._id),
  ]);
  res.status(200).json({ success: true, notifications, unreadCount });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.user._id, req.params.id);
  res.status(200).json({ success: true, notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  res.status(200).json({ success: true });
});

module.exports = { list, markRead, markAllRead };
