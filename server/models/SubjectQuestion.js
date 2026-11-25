const mongoose = require('mongoose');

const subjectQuestionSchema = new mongoose.Schema(
  {
    course: { type: String, enum: ['BE', 'BCA'], required: true },
    subject: {
      type: String,
      enum: ['Operating Systems', 'DBMS', 'Computer Networks', 'Programming Fundamentals', 'Web Development', 'SQL'],
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

module.exports = mongoose.model('SubjectQuestion', subjectQuestionSchema);
