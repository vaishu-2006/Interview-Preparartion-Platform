const mongoose = require('mongoose');

const interviewTurnSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    index: { type: Number, required: true },
    questionText: { type: String, required: true },
    questionCategory: { type: String, enum: ['Technical', 'Behavioral', 'HR'], required: true },
    answerMode: { type: String, enum: ['voice', 'text', 'coding', 'skipped'], default: 'text' },
    answerText: { type: String, default: '' },
    skipped: { type: Boolean, default: false },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

interviewTurnSchema.index({ sessionId: 1, index: 1 });

module.exports = mongoose.model('InterviewTurn', interviewTurnSchema);
