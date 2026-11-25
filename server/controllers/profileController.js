const asyncHandler = require('../utils/asyncHandler');
const profileService = require('../services/profileService');

const getFullProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getFullProfile(req.user._id);
  res.status(200).json({ success: true, profile });
});

const updateFullProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateFullProfile(req.user._id, req.body);
  res.status(200).json({ success: true, message: 'Profile updated successfully', profile });
});

module.exports = { getFullProfile, updateFullProfile };
