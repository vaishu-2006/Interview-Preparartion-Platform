const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['Numerical', 'Logical', 'Verbal', 'Non-Verbal'], required: true },
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (v) => v.length >= 2,
    },
    correctOptionIndex: { type: Number, required: true },
    explanation: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
