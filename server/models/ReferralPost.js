const mongoose = require('mongoose');

// Real, user-posted "I can refer at X" / "looking for a referral at Y" board — not a scraped
// or fabricated listings database, just students helping each other with real contacts.
const referralPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    type: { type: String, enum: ['offering', 'seeking'], required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    contact: { type: String, default: '' },
  },
  { timestamps: true }
);

referralPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ReferralPost', referralPostSchema);
