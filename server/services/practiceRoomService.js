const crypto = require('crypto');
const PracticeRoom = require('../models/PracticeRoom');
const ApiError = require('../utils/ApiError');

const generateRoomCode = () => crypto.randomBytes(4).toString('hex');
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

const listOpenRooms = () => PracticeRoom.find({ status: 'open' }).sort({ createdAt: -1 }).limit(30);

// Only future-dated, not-yet-fully-booked scheduled rooms — a 'reserved' one (already has a
// second person) or one whose time has passed drops off this discovery list.
const listScheduledRooms = () =>
  PracticeRoom.find({ status: 'scheduled', scheduledFor: { $gt: new Date() } })
    .sort({ scheduledFor: 1 })
    .limit(30);

// A student's own upcoming commitments — hosted or reserved — regardless of whether they still
// show on the public board (a 'reserved' scheduled room no longer does, but the two people who
// booked it still need to find their way back to it).
const listMyUpcomingRooms = (userId) =>
  PracticeRoom.find({
    $or: [{ hostId: userId }, { joinedById: userId }],
    status: { $in: ['scheduled', 'reserved'] },
  }).sort({ scheduledFor: 1 });

const hostRoom = async (userId, hostName, { topic, scheduledFor }) => {
  if (!topic?.trim()) throw new ApiError(422, 'topic is required');

  let scheduledDate = null;
  if (scheduledFor) {
    scheduledDate = new Date(scheduledFor);
    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      throw new ApiError(422, 'scheduledFor must be a valid future date/time');
    }
  }

  const roomCode = generateRoomCode();
  const expiresAt = new Date((scheduledDate?.getTime() || Date.now()) + THREE_HOURS_MS);

  return PracticeRoom.create({
    hostId: userId,
    hostName,
    topic: topic.trim(),
    roomCode,
    status: scheduledDate ? 'scheduled' : 'open',
    scheduledFor: scheduledDate,
    expiresAt,
  });
};

const getRoom = async (roomId) => {
  const room = await PracticeRoom.findById(roomId);
  if (!room) throw new ApiError(404, 'Room not found');
  return room;
};

const joinRoom = async (userId, userName, roomId) => {
  const room = await getRoom(roomId);
  if (!['open', 'scheduled'].includes(room.status)) {
    throw new ApiError(409, 'This room is no longer available to join');
  }
  if (String(room.hostId) === String(userId)) {
    throw new ApiError(409, "You can't join your own room — share it with someone else");
  }
  room.status = room.status === 'scheduled' ? 'reserved' : 'active';
  room.joinedById = userId;
  room.joinedByName = userName;
  await room.save();
  return room;
};

const closeRoom = async (userId, roomId) => {
  const room = await getRoom(roomId);
  if (String(room.hostId) !== String(userId)) {
    throw new ApiError(403, 'Only the host can close this room');
  }
  room.status = 'closed';
  await room.save();
};

module.exports = { listOpenRooms, listScheduledRooms, listMyUpcomingRooms, hostRoom, getRoom, joinRoom, closeRoom };
