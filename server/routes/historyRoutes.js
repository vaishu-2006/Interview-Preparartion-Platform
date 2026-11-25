const express = require('express');
const historyController = require('../controllers/historyController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, historyController.getHistory);
router.get('/performance', protect, historyController.getPerformance);

module.exports = router;
