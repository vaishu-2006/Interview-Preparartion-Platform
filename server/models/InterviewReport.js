const mongoose = require('mongoose');

const questionFeedbackSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    questionText: { type: String, required: true },
    answerText: { type: String, default: '' },
    feedback: { type: String, default: '' },
    score: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobRole: { type: String, required: true },
    interviewType: { type: String, enum: ['Technical', 'Behavioral', 'HR'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    durationMinutes: { type: Number, default: 20 },
    technicalAccuracy: { type: Number, min: 0, max: 100, default: 0 },
    communication: { type: Number, min: 0, max: 100, default: 0 },
    confidence: { type: Number, min: 0, max: 100, default: 0 },
    eyeContact: { type: Number, min: 0, max: 100, default: 0 },
    behavior: { type: Number, min: 0, max: 100, default: 0 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    questionFeedback: { type: [questionFeedbackSchema], default: [] },
    generatedByAI: { type: Boolean, default: false },
    aiProvider: { type: String, default: 'mock' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
