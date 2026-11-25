const asyncHandler = require('../utils/asyncHandler');
const achievementsService = require('../services/achievementsService');

const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await achievementsService.getAchievements(req.user._id);
  res.status(200).json({ success: true, achievements });
});

module.exports = { getAchievements };
