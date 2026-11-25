const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    configId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewConfiguration', required: true },
    jobRole: { type: String, required: true },
    interviewType: { type: String, enum: ['Technical', 'Behavioral', 'HR'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    durationMinutes: { type: Number, default: 20 },
    resumeSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    totalQuestions: { type: Number, default: 5 },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    violations: [
      {
        type: {
          type: String,
          enum: ['tab_switch', 'copy', 'paste', 'right_click', 'devtools_shortcut', 'phone_detected'],
          required: true,
        },
        questionIndex: { type: Number },
        screenshot: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    violationCount: { type: Number, default: 0 },
    autoSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
