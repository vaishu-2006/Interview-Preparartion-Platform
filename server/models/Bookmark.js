const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, href: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
