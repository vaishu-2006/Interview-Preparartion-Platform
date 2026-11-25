const Flashcard = require('../models/Flashcard');
const ApiError = require('../utils/ApiError');
const { applySm2 } = require('../utils/spacedRepetition');

const VALID_QUALITIES = [1, 3, 4, 5];

const createCard = async (userId, { front, back, category }) => {
  if (!front?.trim() || !back?.trim()) throw new ApiError(422, 'front and back are required');
  return Flashcard.create({ userId, front: front.trim(), back: back.trim(), category: category?.trim() || '' });
};

const listCards = (userId) => Flashcard.find({ userId }).sort({ createdAt: -1 });

const getDueCards = (userId, limit = 30) =>
  Flashcard.find({ userId, dueDate: { $lte: new Date() } })
    .sort({ dueDate: 1 })
    .limit(limit);

const getCard = async (userId, id) => {
  const card = await Flashcard.findOne({ _id: id, userId });
  if (!card) throw new ApiError(404, 'Flashcard not found');
  return card;
};

const updateCard = async (userId, id, { front, back, category }) => {
  const card = await getCard(userId, id);
  if (front !== undefined) card.front = front.trim();
  if (back !== undefined) card.back = back.trim();
  if (category !== undefined) card.category = category.trim();
  await card.save();
  return card;
};

const deleteCard = async (userId, id) => {
  const res = await Flashcard.deleteOne({ _id: id, userId });
  if (!res.deletedCount) throw new ApiError(404, 'Flashcard not found');
};

const reviewCard = async (userId, id, quality) => {
  if (!VALID_QUALITIES.includes(quality)) {
    throw new ApiError(422, 'quality must be one of 1 (Again), 3 (Hard), 4 (Good), 5 (Easy)');
  }
  const card = await getCard(userId, id);
  const next = applySm2({ easeFactor: card.easeFactor, interval: card.interval, repetitions: card.repetitions }, quality);
  card.easeFactor = next.easeFactor;
  card.interval = next.interval;
  card.repetitions = next.repetitions;
  card.dueDate = next.dueDate;
  card.lastReviewedAt = new Date();
  await card.save();
  return card;
};

const getStats = async (userId) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [total, due, reviewedToday] = await Promise.all([
    Flashcard.countDocuments({ userId }),
    Flashcard.countDocuments({ userId, dueDate: { $lte: new Date() } }),
    Flashcard.countDocuments({ userId, lastReviewedAt: { $gte: todayStart } }),
  ]);
  return { total, due, reviewedToday };
};

module.exports = { createCard, listCards, getDueCards, getCard, updateCard, deleteCard, reviewCard, getStats };
