const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'UpscQuestion', required: true },
    selectedOptionIndex: { type: Number, default: -1 },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const upscAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stage: { type: String, enum: ['Prelims', 'Mains', 'Daily'], default: 'Prelims' },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UpscAttempt', upscAttemptSchema);
