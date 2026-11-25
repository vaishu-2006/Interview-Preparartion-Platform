const mongoose = require('mongoose');

// A lightweight matchmaking board for the WebRTC peer practice rooms — real user-hosted
// listings, not a persistent record of calls (no audio/video ever touches the server or this
// document). Supports both "join right now" (status starts 'open') and booking a future slot
// (status starts 'scheduled', becomes 'reserved' once a second person signs up).
const practiceRoomSchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hostName: { type: String, required: true },
    topic: { type: String, required: true, trim: true },
    roomCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['open', 'scheduled', 'reserved', 'active', 'closed'], default: 'open' },
    joinedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    joinedByName: { type: String, default: '' },
    scheduledFor: { type: Date, default: null },
    // Computed at creation: instant rooms expire ~3h after creation; scheduled rooms expire ~3h
    // after their scheduled start (so a room booked far ahead doesn't vanish before it happens).
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

practiceRoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PracticeRoom', practiceRoomSchema);
