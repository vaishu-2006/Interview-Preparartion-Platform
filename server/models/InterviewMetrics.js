const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    questionIndex: { type: Number, default: 0 },
    confidenceScore: { type: Number, min: 0, max: 100 },
    eyeContactScore: { type: Number, min: 0, max: 100 },
    headStability: { type: Number, min: 0, max: 100 },
    smileScore: { type: Number, min: 0, max: 100 },
    expression: { type: String, enum: ['Confident', 'Neutral', 'Confused', 'Nervous'] },
  },
  { _id: false }
);

const interviewMetricsSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    samples: { type: [sampleSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewMetrics', interviewMetricsSchema);
