const mongoose = require('mongoose');

// User-authored flashcards with real SM-2 scheduling state — content is always written by the
// student, never AI-generated, per the explicit "not AI-generated content" requirement. Usable
// for any course: UPSC facts/current-affairs, or BE/BCA subject concepts.
const flashcardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    front: { type: String, required: true, trim: true },
    back: { type: String, required: true, trim: true },
    category: { type: String, default: '', trim: true },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
    dueDate: { type: Date, default: Date.now }, // new cards are immediately due
    lastReviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

flashcardSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
