const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema(
  { input: String, output: String, explanation: String },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const codingQuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topics: { type: [String], default: [] },
    statement: { type: String, required: true },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    constraints: { type: String, default: '' },
    examples: { type: [exampleSchema], default: [] },
    starterCode: {
      c: { type: String, default: '' },
      cpp: { type: String, default: '' },
      java: { type: String, default: '' },
      python: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },
    testCases: { type: [testCaseSchema], default: [] },
    hints: { type: [String], default: [] },
    editorial: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
