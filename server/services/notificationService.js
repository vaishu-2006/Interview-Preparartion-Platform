const Notification = require('../models/Notification');
const pushService = require('./pushService');

// Fire-and-forget, same pattern as awardPoints — a notification failing to write should never
// break the real action (an assignment being created, an event going live) that triggered it.
// Every call here also fires a real browser push alongside the in-app notification — pushService
// itself no-ops silently if VAPID isn't configured or the user has no active subscription, so
// this needs no extra gating here.
const notify = async (userId, { type, message, link }) => {
  try {
    await Notification.create({ userId, type, message, link: link || '' });
  } catch {
    // best-effort only
  }
  pushService.sendToUser(userId, { title: 'PlacementPrep', body: message, url: link || '/dashboard' });
};

const notifyMany = async (userIds, { type, message, link }) => {
  try {
    await Notification.insertMany(userIds.map((userId) => ({ userId, type, message, link: link || '' })));
  } catch {
    // best-effort only
  }
  pushService.sendToUsers(userIds, { title: 'PlacementPrep', body: message, url: link || '/dashboard' });
};

const listForUser = (userId) => Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);

const unreadCount = (userId) => Notification.countDocuments({ userId, read: false });

const markRead = (userId, id) => Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });

const markAllRead = (userId) => Notification.updateMany({ userId, read: false }, { read: true });

module.exports = { notify, notifyMany, listForUser, unreadCount, markRead, markAllRead };
