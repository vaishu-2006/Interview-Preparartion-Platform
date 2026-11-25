const asyncHandler = require('../utils/asyncHandler');
const historyService = require('../services/historyService');
const performanceService = require('../services/performanceService');

const getHistory = asyncHandler(async (req, res) => {
  const entries = await historyService.getUnifiedHistory(req.user._id);
  res.status(200).json({ success: true, entries });
});

const getPerformance = asyncHandler(async (req, res) => {
  const overview = await performanceService.getPerformanceOverview(req.user._id);
  res.status(200).json({ success: true, overview });
});

module.exports = { getHistory, getPerformance };
