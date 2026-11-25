const express = require('express');
const achievementsController = require('../controllers/achievementsController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, achievementsController.getAchievements);

module.exports = router;
