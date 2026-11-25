const mongoose = require('mongoose');

const answerWritingAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    answerText: { type: String, required: true },
    feedback: { type: [String], default: [] },
    score: { type: Number, min: 0, max: 100, default: 0 },
    generatedByAI: { type: Boolean, default: false },
    aiProvider: { type: String, default: 'mock' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AnswerWritingAttempt', answerWritingAttemptSchema);
