const express = require('express');
const upscController = require('../controllers/upscController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/mock-tests/quiz', protect, upscController.getQuiz);
router.post('/mock-tests/submit', protect, upscController.submitQuiz);
router.get('/mock-tests/stats', protect, upscController.getStats);
router.get('/mock-tests/ranking', protect, upscController.getRanking);

router.post('/answer-writing', protect, upscController.submitAnswerWriting);
router.get('/answer-writing/history', protect, upscController.getAnswerWritingHistory);

router.post('/doubt-solver/ask', protect, upscController.askDoubt);

router.get('/current-affairs/live', protect, upscController.getLiveCurrentAffairs);

module.exports = router;
