const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion', required: true },
    selectedOptionIndex: { type: Number, default: -1 },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Numerical', 'Logical', 'Verbal', 'Non-Verbal'], required: true },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: null }, // from face-tracking samples during the test, null if unavailable
  },
  { timestamps: true }
);

module.exports = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
