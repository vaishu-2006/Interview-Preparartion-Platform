const asyncHandler = require('../utils/asyncHandler');
const portfolioService = require('../services/portfolioService');

const getMySettings = asyncHandler(async (req, res) => {
  const settings = await portfolioService.getMySettings(req.user._id);
  res.status(200).json({ success: true, ...settings });
});

const setPublic = asyncHandler(async (req, res) => {
  const settings = await portfolioService.setPublic(req.user._id, Boolean(req.body.isPublic));
  res.status(200).json({ success: true, ...settings });
});

// Public — no auth. Only ever returns data for a profile that has explicitly opted in.
const getPublicPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await portfolioService.getPublicPortfolio(req.params.slug);
  res.status(200).json({ success: true, portfolio });
});

module.exports = { getMySettings, setPublic, getPublicPortfolio };
