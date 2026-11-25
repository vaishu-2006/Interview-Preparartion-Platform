const mongoose = require('mongoose');
const ContestTeam = require('../models/ContestTeam');
const CodingAttempt = require('../models/CodingAttempt');
const ApiError = require('../utils/ApiError');

const MAX_TEAM_SIZE = 4;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 — avoids ambiguous invite codes

const generateInviteCode = () =>
  Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

const getMyTeam = async (userId) => {
  const team = await ContestTeam.findOne({ members: userId }).populate('members', 'name');
  if (!team) return null;
  return {
    id: team._id,
    name: team.name,
    inviteCode: team.inviteCode,
    createdBy: team.createdBy,
    members: team.members.map((m) => ({ id: m._id, name: m.name })),
  };
};

const createTeam = async (userId, name) => {
  if (!name?.trim()) throw new ApiError(422, 'Team name is required');
  const existing = await ContestTeam.findOne({ members: userId });
  if (existing) throw new ApiError(409, 'You are already in a team — leave it first to create a new one');

  let inviteCode;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateInviteCode();
    // eslint-disable-next-line no-await-in-loop
    if (!(await ContestTeam.exists({ inviteCode: candidate }))) {
      inviteCode = candidate;
      break;
    }
  }
  if (!inviteCode) throw new ApiError(500, 'Could not generate a unique invite code, try again');

  const team = await ContestTeam.create({ name: name.trim(), inviteCode, createdBy: userId, members: [userId] });
  return getMyTeam(userId) || { id: team._id, name: team.name, inviteCode: team.inviteCode, members: [] };
};

const joinTeam = async (userId, inviteCode) => {
  if (!inviteCode?.trim()) throw new ApiError(422, 'Invite code is required');
  const existing = await ContestTeam.findOne({ members: userId });
  if (existing) throw new ApiError(409, 'You are already in a team — leave it first to join another');

  const team = await ContestTeam.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
  if (!team) throw new ApiError(404, 'No team found with that invite code');
  if (team.members.length >= MAX_TEAM_SIZE) throw new ApiError(409, `This team is already full (max ${MAX_TEAM_SIZE})`);

  team.members.push(userId);
  await team.save();
  return getMyTeam(userId);
};

const leaveTeam = async (userId) => {
  const team = await ContestTeam.findOne({ members: userId });
  if (!team) throw new ApiError(404, 'You are not in a team');

  team.members = team.members.filter((m) => String(m) !== String(userId));
  if (!team.members.length) {
    await team.deleteOne();
    return;
  }
  if (String(team.createdBy) === String(userId)) {
    team.createdBy = team.members[0];
  }
  await team.save();
};

// Team score for a contest is always the live sum of its real members' real distinct solves —
// never a separately tracked total, so it can't drift from what members actually did.
const getTeamLeaderboard = async (contestId) => {
  const perUser = await CodingAttempt.aggregate([
    { $match: { contestId: new mongoose.Types.ObjectId(contestId), status: 'Accepted' } },
    { $group: { _id: { userId: '$userId', questionId: '$questionId' } } },
    { $group: { _id: '$_id.userId', solvedCount: { $sum: 1 } } },
  ]);
  const solvedMap = new Map(perUser.map((r) => [String(r._id), r.solvedCount]));

  const teams = await ContestTeam.find().select('name members').lean();
  return teams
    .map((t) => ({
      teamId: t._id,
      name: t.name,
      memberCount: t.members.length,
      solvedCount: t.members.reduce((sum, m) => sum + (solvedMap.get(String(m)) || 0), 0),
    }))
    .filter((r) => r.solvedCount > 0)
    .sort((a, b) => b.solvedCount - a.solvedCount)
    .slice(0, 20);
};

module.exports = { getMyTeam, createTeam, joinTeam, leaveTeam, getTeamLeaderboard, MAX_TEAM_SIZE };
