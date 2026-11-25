const express = require('express');
const pushController = require('../controllers/pushController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/status', protect, pushController.getStatus);
router.post('/subscribe', protect, pushController.subscribe);
router.post('/unsubscribe', protect, pushController.unsubscribe);

module.exports = router;
