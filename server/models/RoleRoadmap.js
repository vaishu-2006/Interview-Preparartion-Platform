const mongoose = require('mongoose');

// AI-generated roadmaps are cached per (normalized role, course) so a common search like
// "Backend Developer" only costs one AI call across all students, not one per search.
const roleRoadmapStageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    points: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    milestone: { type: String, default: '' },
  },
  { _id: false }
);

const roleRoadmapSchema = new mongoose.Schema(
  {
    roleSlug: { type: String, required: true, trim: true, lowercase: true },
    course: { type: String, default: '' },
    role: { type: String, required: true, trim: true },
    stages: { type: [roleRoadmapStageSchema], default: [] },
    aiProvider: { type: String, default: '' },
  },
  { timestamps: true }
);

roleRoadmapSchema.index({ roleSlug: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('RoleRoadmap', roleRoadmapSchema);
