const mongoose = require('mongoose');

// Persistent squads (not per-contest) — a team keeps competing together every weekend. Real
// membership only: a team's score is always the live sum of its actual members' real solves,
// never a separate tracked total that could drift from reality.
const contestTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    inviteCode: { type: String, required: true, unique: true, uppercase: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContestTeam', contestTeamSchema);
