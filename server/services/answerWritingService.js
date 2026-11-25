const AnswerWritingAttempt = require('../models/AnswerWritingAttempt');
const ApiError = require('../utils/ApiError');
const aiService = require('./aiService');
const awardPoints = require('../utils/awardPoints');

const POINTS_PER_ATTEMPT = 5;

const submitAnswer = async (userId, { prompt, answerText }) => {
  if (!prompt?.trim() || !answerText?.trim()) {
    throw new ApiError(422, 'prompt and answerText are required');
  }
  const { score, feedback, generatedByAI, aiProvider } = await aiService.scoreAnswerWriting({ prompt, answerText });

  const attempt = await AnswerWritingAttempt.create({
    userId,
    prompt: prompt.trim(),
    answerText: answerText.trim(),
    feedback,
    score,
    generatedByAI,
    aiProvider,
  });
  await awardPoints(userId, POINTS_PER_ATTEMPT);

  return attempt;
};

const getHistory = (userId) => AnswerWritingAttempt.find({ userId }).sort({ createdAt: -1 }).limit(20);

module.exports = { submitAnswer, getHistory };
