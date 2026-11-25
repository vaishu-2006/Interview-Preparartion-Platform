const CodingAttempt = require('../models/CodingAttempt');
const CodingQuestion = require('../models/CodingQuestion');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { jaccardSimilarity } = require('../utils/codeSimilarity');

const MIN_REPORTED_SIMILARITY = 55; // below this, treat it as noise and don't surface it

const checkSimilarity = async (slug) => {
  const question = await CodingQuestion.findOne({ slug }).select('_id title');
  if (!question) throw new ApiError(404, 'Problem not found');

  // Latest submission per user for this problem — copying shows up even on a failed attempt,
  // so this isn't restricted to Accepted-only.
  const attempts = await CodingAttempt.aggregate([
    { $match: { questionId: question._id } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$userId', code: { $first: '$code' }, language: { $first: '$language' }, createdAt: { $first: '$createdAt' } } },
  ]);
  if (attempts.length < 2) {
    return { problemTitle: question.title, submissionCount: attempts.length, pairs: [] };
  }

  const users = await User.find({ _id: { $in: attempts.map((a) => a._id) } }).select('name');
  const nameMap = new Map(users.map((u) => [String(u._id), u.name]));

  const pairs = [];
  for (let i = 0; i < attempts.length; i += 1) {
    for (let j = i + 1; j < attempts.length; j += 1) {
      const a = attempts[i];
      const b = attempts[j];
      if (a.language !== b.language) continue; // not meaningfully comparable across languages
      const similarity = jaccardSimilarity(a.code, b.code);
      if (similarity >= MIN_REPORTED_SIMILARITY) {
        pairs.push({
          userAId: a._id,
          userAName: nameMap.get(String(a._id)) || 'Unknown',
          userBId: b._id,
          userBName: nameMap.get(String(b._id)) || 'Unknown',
          similarity,
          language: a.language,
        });
      }
    }
  }
  pairs.sort((x, y) => y.similarity - x.similarity);

  return { problemTitle: question.title, submissionCount: attempts.length, pairs: pairs.slice(0, 30) };
};

module.exports = { checkSimilarity };
