const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    module: { type: String, default: '' },
    occurredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const dashboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    selectedPath: { type: String, enum: ['BE', 'BCA', 'UPSC', null], default: null },
    lastLogin: { type: Date, default: Date.now },
    currentProgress: { type: Number, default: 0, min: 0, max: 100 },
    recentActivities: { type: [activitySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
