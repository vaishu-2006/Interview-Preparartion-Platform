const mongoose = require('mongoose');

// One document per calendar week (ISO week key, e.g. "2026-W32"), lazily created the first
// time anyone asks for "this week's contest" — see contestService.getCurrentContest.
const contestSchema = new mongoose.Schema(
  {
    weekKey: { type: String, required: true, unique: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    problemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contest', contestSchema);
