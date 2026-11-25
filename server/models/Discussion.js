const mongoose = require('mongoose');

// Flat, unthreaded comments scoped to a single coding problem — a lightweight doubt/discussion
// board, not a full forum. userName is snapshotted at post time so a later name change doesn't
// need a join on every read.
const discussionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

discussionSchema.index({ problemId: 1, createdAt: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);
