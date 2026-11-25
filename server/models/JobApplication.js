const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interviewing', 'offer', 'rejected'],
      default: 'saved',
    },
    link: { type: String, default: '' },
    notes: { type: String, default: '' },
    appliedDate: { type: Date },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
