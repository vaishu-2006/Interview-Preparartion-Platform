const express = require('express');
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/settings', protect, portfolioController.getMySettings);
router.put('/settings', protect, portfolioController.setPublic);
router.get('/:slug', portfolioController.getPublicPortfolio); // public, no auth

module.exports = router;
