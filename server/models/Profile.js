const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    course: { type: String, enum: ['BE', 'BCA', 'UPSC', null], default: null },
    branch: { type: String, default: '' },
    college: { type: String, default: '' },
    year: { type: String, default: '' },
    skills: { type: [String], default: [] },
    targetRole: { type: String, default: '' },
    targetCompany: { type: String, default: '' },
    points: { type: Number, default: 0 },
    // Opt-in only, default off — a public, read-only stats page shareable via a link. The slug
    // is kept even after disabling so re-enabling reuses the same URL instead of breaking it.
    isPortfolioPublic: { type: Boolean, default: false },
    // Deliberately no `default: null` here — a sparse unique index only skips documents where
    // the field is genuinely absent. An explicit `null` (which `default: null` would write to
    // every new document) still counts as "has a value" for indexing purposes, so a second such
    // document collides on a duplicate-key error. Leaving it unset until first enabled avoids that.
    portfolioSlug: { type: String },
  },
  { timestamps: true }
);

profileSchema.index({ portfolioSlug: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Profile', profileSchema);
