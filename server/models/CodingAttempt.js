const mongoose = require('mongoose');

const codingAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
    language: { type: String, enum: ['c', 'cpp', 'java', 'python', 'javascript'], required: true },
    code: { type: String, required: true },
    mode: { type: String, enum: ['run', 'submit'], required: true },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error'],
      required: true,
    },
    output: { type: String, default: '' },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: null },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', default: null },
  },
  { timestamps: true }
);

codingAttemptSchema.index({ userId: 1, questionId: 1 });
codingAttemptSchema.index({ contestId: 1 });

module.exports = mongoose.model('CodingAttempt', codingAttemptSchema);
