const mongoose = require('mongoose');

const problemAssignmentSchema = new mongoose.Schema(
  {
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null when assignedToAll
    assignedToAll: { type: Boolean, default: false },
    course: { type: String, enum: ['BE', 'BCA', 'UPSC', null], default: null }, // scopes "all" to a course
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProblemAssignment', problemAssignmentSchema);
