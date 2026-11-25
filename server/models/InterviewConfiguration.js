const mongoose = require('mongoose');

const interviewConfigurationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobRole: { type: String, required: true },
    interviewType: { type: String, enum: ['Technical', 'Behavioral', 'HR'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    resumeSource: { type: String, enum: ['platform', 'upload', 'none'], default: 'none' },
    uploadedResumePath: { type: String, default: '' },
    durationMinutes: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewConfiguration', interviewConfigurationSchema);
