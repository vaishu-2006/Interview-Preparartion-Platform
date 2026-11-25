const express = require('express');
const contestController = require('../controllers/contestController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/current', protect, contestController.getCurrentContest);
router.get('/previous', protect, contestController.getPreviousContest);
router.get('/my-stats', protect, contestController.getMyStats);
router.get('/:contestId/leaderboard', protect, contestController.getLeaderboard);
router.get('/:contestId/certificate', protect, contestController.downloadCertificate);

module.exports = router;
