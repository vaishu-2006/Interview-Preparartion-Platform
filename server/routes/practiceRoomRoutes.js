const express = require('express');
const practiceRoomController = require('../controllers/practiceRoomController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, practiceRoomController.listOpenRooms);
router.get('/mine', protect, practiceRoomController.listMyUpcomingRooms);
router.post('/', protect, practiceRoomController.hostRoom);
router.get('/:roomId', protect, practiceRoomController.getRoom);
router.post('/:roomId/join', protect, practiceRoomController.joinRoom);
router.post('/:roomId/close', protect, practiceRoomController.closeRoom);

module.exports = router;
