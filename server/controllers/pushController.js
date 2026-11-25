const asyncHandler = require('../utils/asyncHandler');
const pushService = require('../services/pushService');

const getStatus = asyncHandler(async (req, res) => {
  const subscribed = await pushService.hasSubscription(req.user._id);
  res.status(200).json({ success: true, configured: pushService.isConfigured(), publicKey: pushService.getPublicKey(), subscribed });
});

const subscribe = asyncHandler(async (req, res) => {
  await pushService.saveSubscription(req.user._id, req.body.subscription);
  res.status(200).json({ success: true });
});

const unsubscribe = asyncHandler(async (req, res) => {
  await pushService.removeSubscription(req.user._id, req.body.endpoint);
  res.status(200).json({ success: true });
});

module.exports = { getStatus, subscribe, unsubscribe };
