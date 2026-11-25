const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const ApiError = require('../utils/ApiError');

// Real Web Push — no third-party account needed (unlike SMS/WhatsApp/email), just a
// self-generated VAPID key pair set once in .env. If it's not configured, sends are silently
// skipped, never faked or queued as if they went out.
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@placementprep.local';

const isConfigured = () => Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
if (isConfigured()) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const getPublicKey = () => VAPID_PUBLIC_KEY || null;

const saveSubscription = async (userId, subscription) => {
  const { endpoint, keys } = subscription || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new ApiError(422, 'Invalid push subscription payload');
  }
  await PushSubscription.findOneAndUpdate({ endpoint }, { userId, endpoint, keys }, { upsert: true });
};

const removeSubscription = async (userId, endpoint) => {
  await PushSubscription.deleteOne({ userId, endpoint });
};

const hasSubscription = async (userId) => Boolean(await PushSubscription.exists({ userId }));

// Fired alongside the existing in-app Notification, same fire-and-forget discipline — a failed
// or unconfigured push should never break the real action that triggered it.
const sendToUser = async (userId, { title, body, url }) => {
  if (!isConfigured()) return;
  try {
    const subs = await PushSubscription.find({ userId });
    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, JSON.stringify({ title, body, url }));
        } catch (err) {
          // 404/410 means the subscription is dead (browser data cleared, uninstalled, etc.).
          if (err.statusCode === 404 || err.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id });
          } else {
            console.error('Push send failed:', err.message);
          }
        }
      })
    );
  } catch {
    // best-effort only
  }
};

const sendToUsers = (userIds, payload) => Promise.all(userIds.map((id) => sendToUser(id, payload)));

module.exports = { isConfigured, getPublicKey, saveSubscription, removeSubscription, hasSubscription, sendToUser, sendToUsers };
