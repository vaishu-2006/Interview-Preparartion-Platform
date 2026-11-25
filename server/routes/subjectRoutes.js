const express = require('express');
const subjectController = require('../controllers/subjectController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/subjects', protect, subjectController.getSubjects);
router.get('/quiz', protect, subjectController.getQuiz);
router.post('/submit', protect, subjectController.submitAttempt);
router.get('/stats', protect, subjectController.getStats);

module.exports = router;
