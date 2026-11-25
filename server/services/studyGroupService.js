const StudyGroup = require('../models/StudyGroup');
const StudyGroupMessage = require('../models/StudyGroupMessage');
const ApiError = require('../utils/ApiError');

const listGroups = (course) => StudyGroup.find({ $or: [{ course: null }, { course }] }).sort({ createdAt: -1 });

const createGroup = async (userId, { name, description, course }) => {
  if (!name?.trim()) {
    throw new ApiError(422, 'name is required');
  }
  return StudyGroup.create({ name: name.trim(), description: description || '', course: course || null, createdBy: userId, members: [userId] });
};

const getGroup = async (groupId) => {
  const group = await StudyGroup.findById(groupId);
  if (!group) throw new ApiError(404, 'Study group not found');
  return group;
};

const joinGroup = async (userId, groupId) => {
  const group = await getGroup(groupId);
  if (!group.members.some((m) => String(m) === String(userId))) {
    group.members.push(userId);
    await group.save();
  }
  return group;
};

const leaveGroup = async (userId, groupId) => {
  const group = await getGroup(groupId);
  group.members = group.members.filter((m) => String(m) !== String(userId));
  await group.save();
  return group;
};

const requireMember = async (userId, groupId) => {
  const group = await getGroup(groupId);
  if (!group.members.some((m) => String(m) === String(userId))) {
    throw new ApiError(403, 'Join this study group before viewing or posting messages');
  }
  return group;
};

const listMessages = async (userId, groupId) => {
  await requireMember(userId, groupId);
  return StudyGroupMessage.find({ groupId }).sort({ createdAt: 1 }).limit(200);
};

const postMessage = async (userId, userName, groupId, body) => {
  await requireMember(userId, groupId);
  if (!body?.trim()) {
    throw new ApiError(422, 'Message cannot be empty');
  }
  return StudyGroupMessage.create({ groupId, userId, userName, body: body.trim() });
};

module.exports = { listGroups, createGroup, getGroup, joinGroup, leaveGroup, listMessages, postMessage };
