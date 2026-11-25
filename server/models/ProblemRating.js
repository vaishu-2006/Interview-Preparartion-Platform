const mongoose = require('mongoose');

// Real community signal on whether a problem is worth doing — one rating per user per problem,
// re-rating updates it rather than creating duplicates. Never used to fabricate difficulty; the
// question's own `difficulty` field stays authoritative, this is purely a perception signal.
const problemRatingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
    qualityRating: { type: Number, min: 1, max: 5, required: true },
    difficultyPerception: { type: String, enum: ['Too Easy', 'Just Right', 'Too Hard'], required: true },
  },
  { timestamps: true }
);

problemRatingSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('ProblemRating', problemRatingSchema);
