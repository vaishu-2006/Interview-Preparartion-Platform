const asyncHandler = require('../utils/asyncHandler');
const practiceRoomService = require('../services/practiceRoomService');

const listOpenRooms = asyncHandler(async (req, res) => {
  const [instant, scheduled] = await Promise.all([practiceRoomService.listOpenRooms(), practiceRoomService.listScheduledRooms()]);
  res.status(200).json({ success: true, instant, scheduled });
});

const listMyUpcomingRooms = asyncHandler(async (req, res) => {
  const rooms = await practiceRoomService.listMyUpcomingRooms(req.user._id);
  res.status(200).json({ success: true, rooms });
});

const hostRoom = asyncHandler(async (req, res) => {
  const room = await practiceRoomService.hostRoom(req.user._id, req.user.name, req.body);
  res.status(201).json({ success: true, room });
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await practiceRoomService.getRoom(req.params.roomId);
  res.status(200).json({ success: true, room });
});

const joinRoom = asyncHandler(async (req, res) => {
  const room = await practiceRoomService.joinRoom(req.user._id, req.user.name, req.params.roomId);
  res.status(200).json({ success: true, room });
});

const closeRoom = asyncHandler(async (req, res) => {
  await practiceRoomService.closeRoom(req.user._id, req.params.roomId);
  res.status(200).json({ success: true });
});

module.exports = { listOpenRooms, listMyUpcomingRooms, hostRoom, getRoom, joinRoom, closeRoom };
