const express = require('express');
const careerController = require('../controllers/careerController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/roadmap-search', protect, careerController.searchRoadmap);

module.exports = router;
