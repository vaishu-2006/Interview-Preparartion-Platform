const asyncHandler = require('../utils/asyncHandler');
const studyGroupService = require('../services/studyGroupService');
const Profile = require('../models/Profile');

const listGroups = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const groups = await studyGroupService.listGroups(profile?.course);
  res.status(200).json({ success: true, groups });
});

const createGroup = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id }).select('course');
  const group = await studyGroupService.createGroup(req.user._id, { ...req.body, course: req.body.course || profile?.course });
  res.status(201).json({ success: true, group });
});

const joinGroup = asyncHandler(async (req, res) => {
  const group = await studyGroupService.joinGroup(req.user._id, req.params.groupId);
  res.status(200).json({ success: true, group });
});

const leaveGroup = asyncHandler(async (req, res) => {
  const group = await studyGroupService.leaveGroup(req.user._id, req.params.groupId);
  res.status(200).json({ success: true, group });
});

const listMessages = asyncHandler(async (req, res) => {
  const messages = await studyGroupService.listMessages(req.user._id, req.params.groupId);
  res.status(200).json({ success: true, messages });
});

const postMessage = asyncHandler(async (req, res) => {
  const chatMessage = await studyGroupService.postMessage(req.user._id, req.user.name, req.params.groupId, req.body.body);
  res.status(201).json({ success: true, chatMessage });
});

module.exports = { listGroups, createGroup, joinGroup, leaveGroup, listMessages, postMessage };
