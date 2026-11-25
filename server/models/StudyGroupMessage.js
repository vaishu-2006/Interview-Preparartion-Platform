const mongoose = require('mongoose');

const studyGroupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

studyGroupMessageSchema.index({ groupId: 1, createdAt: 1 });

module.exports = mongoose.model('StudyGroupMessage', studyGroupMessageSchema);
