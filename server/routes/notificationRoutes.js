const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, notificationController.list);
router.put('/:id/read', protect, notificationController.markRead);
router.put('/read-all', protect, notificationController.markAllRead);

module.exports = router;
