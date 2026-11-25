const express = require('express');
const codingController = require('../controllers/codingController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/problems', protect, codingController.listProblems);
router.get('/problems/:slug', protect, codingController.getProblem);
router.post('/problems/:slug/run', protect, codingController.runCode);
router.post('/problems/:slug/submit', protect, codingController.submitCode);
router.post('/problems/:slug/review', protect, codingController.reviewCode);
router.post('/problems/:slug/explain', protect, codingController.explainFailure);
router.get('/problems/:slug/ratings', protect, codingController.getRatings);
router.post('/problems/:slug/ratings', protect, codingController.rateProblem);
router.get('/leaderboard', protect, codingController.getLeaderboard);
router.get('/daily', protect, codingController.getDailyChallenge);
router.get('/history', protect, codingController.getHistory);
router.get('/progress', protect, codingController.getProgress);

module.exports = router;
