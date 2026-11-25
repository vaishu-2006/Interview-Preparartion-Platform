const asyncHandler = require('../utils/asyncHandler');
const contestTeamService = require('../services/contestTeamService');

const getMyTeam = asyncHandler(async (req, res) => {
  const team = await contestTeamService.getMyTeam(req.user._id);
  res.status(200).json({ success: true, team });
});

const createTeam = asyncHandler(async (req, res) => {
  const team = await contestTeamService.createTeam(req.user._id, req.body.name);
  res.status(201).json({ success: true, team });
});

const joinTeam = asyncHandler(async (req, res) => {
  const team = await contestTeamService.joinTeam(req.user._id, req.body.inviteCode);
  res.status(200).json({ success: true, team });
});

const leaveTeam = asyncHandler(async (req, res) => {
  await contestTeamService.leaveTeam(req.user._id);
  res.status(200).json({ success: true });
});

const getTeamLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await contestTeamService.getTeamLeaderboard(req.params.contestId);
  res.status(200).json({ success: true, leaderboard });
});

module.exports = { getMyTeam, createTeam, joinTeam, leaveTeam, getTeamLeaderboard };
