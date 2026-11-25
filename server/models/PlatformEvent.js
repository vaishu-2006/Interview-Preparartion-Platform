const mongoose = require('mongoose');

// Real, internal, admin/faculty-created events — not a fabricated partnership with an external
// program. bonusPoints is informational here; actually awarding it to a student is a separate,
// human-verified action (adminService.awardPointsToStudent), not an automatic trigger.
const platformEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    bonusPoints: { type: Number, default: 0 },
    course: { type: String, enum: ['BE', 'BCA', 'UPSC', null], default: null }, // null = all courses
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformEvent', platformEventSchema);
