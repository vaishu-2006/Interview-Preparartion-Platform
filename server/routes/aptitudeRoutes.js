const express = require('express');
const aptitudeController = require('../controllers/aptitudeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/categories', protect, aptitudeController.getCategories);
router.get('/quiz', protect, aptitudeController.getQuiz);
router.post('/submit', protect, aptitudeController.submitAttempt);
router.get('/history', protect, aptitudeController.getHistory);
router.get('/stats', protect, aptitudeController.getStats);
router.post('/practice-more', protect, aptitudeController.practiceMore);

module.exports = router;
