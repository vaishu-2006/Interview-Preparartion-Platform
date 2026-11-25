const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectQuestion', required: true },
    selectedOptionIndex: { type: Number, default: -1 },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const subjectAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, enum: ['BE', 'BCA'], required: true },
    subject: { type: String, required: true },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubjectAttempt', subjectAttemptSchema);
