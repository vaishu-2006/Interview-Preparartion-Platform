const express = require('express');
const contestTeamController = require('../controllers/contestTeamController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/mine', protect, contestTeamController.getMyTeam);
router.post('/', protect, contestTeamController.createTeam);
router.post('/join', protect, contestTeamController.joinTeam);
router.post('/leave', protect, contestTeamController.leaveTeam);
router.get('/leaderboard/:contestId', protect, contestTeamController.getTeamLeaderboard);

module.exports = router;
