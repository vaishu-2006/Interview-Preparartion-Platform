const mongoose = require('mongoose');

const studyTaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date },
    notes: { type: String, default: '' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studyTaskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('StudyTask', studyTaskSchema);
