const mongoose = require('mongoose');

const upscQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Polity', 'Geography', 'History', 'Economy', 'Science & Tech', 'Environment', 'Current Affairs'],
      required: true,
    },
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

module.exports = mongoose.model('UpscQuestion', upscQuestionSchema);
