const asyncHandler = require('../utils/asyncHandler');
const flashcardService = require('../services/flashcardService');

const createCard = asyncHandler(async (req, res) => {
  const card = await flashcardService.createCard(req.user._id, req.body);
  res.status(201).json({ success: true, card });
});

const listCards = asyncHandler(async (req, res) => {
  const cards = await flashcardService.listCards(req.user._id);
  res.status(200).json({ success: true, cards });
});

const getDueCards = asyncHandler(async (req, res) => {
  const cards = await flashcardService.getDueCards(req.user._id);
  res.status(200).json({ success: true, cards });
});

const updateCard = asyncHandler(async (req, res) => {
  const card = await flashcardService.updateCard(req.user._id, req.params.id, req.body);
  res.status(200).json({ success: true, card });
});

const deleteCard = asyncHandler(async (req, res) => {
  await flashcardService.deleteCard(req.user._id, req.params.id);
  res.status(200).json({ success: true });
});

const reviewCard = asyncHandler(async (req, res) => {
  const card = await flashcardService.reviewCard(req.user._id, req.params.id, req.body.quality);
  res.status(200).json({ success: true, card });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await flashcardService.getStats(req.user._id);
  res.status(200).json({ success: true, stats });
});

module.exports = { createCard, listCards, getDueCards, updateCard, deleteCard, reviewCard, getStats };
