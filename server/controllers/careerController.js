const asyncHandler = require('../utils/asyncHandler');
const careerRoadmapService = require('../services/careerRoadmapService');
const Profile = require('../models/Profile');
const ApiError = require('../utils/ApiError');

const searchRoadmap = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role?.trim()) {
    throw new ApiError(422, 'role is required');
  }
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const result = await careerRoadmapService.getRoadmapForRole(role.trim(), profile?.course);
  res.status(200).json({ success: true, ...result });
});

module.exports = { searchRoadmap };
