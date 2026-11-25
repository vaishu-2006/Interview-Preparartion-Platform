const mongoose = require('mongoose');

// Crowd-sourced "I was asked this at X" tags — real user reports, never a claim this platform
// itself verified or fabricated. One user can't spam-tag the same problem+company repeatedly.
const companyTagSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    // Which round it was reported at — 'Other' covers anything that doesn't fit the common
    // OA/Tech/HR shape (take-home, group discussion, etc).
    roundType: { type: String, enum: ['OA', 'Tech-1', 'Tech-2', 'HR', 'Other'], default: 'Other' },
  },
  { timestamps: true }
);

companyTagSchema.index({ problemId: 1, userId: 1, company: 1, roundType: 1 }, { unique: true });

module.exports = mongoose.model('CompanyTag', companyTagSchema);
