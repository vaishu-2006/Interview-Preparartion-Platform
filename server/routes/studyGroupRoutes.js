const express = require('express');
const studyGroupController = require('../controllers/studyGroupController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, studyGroupController.listGroups);
router.post('/', protect, studyGroupController.createGroup);
router.post('/:groupId/join', protect, studyGroupController.joinGroup);
router.post('/:groupId/leave', protect, studyGroupController.leaveGroup);
router.get('/:groupId/messages', protect, studyGroupController.listMessages);
router.post('/:groupId/messages', protect, studyGroupController.postMessage);

module.exports = router;
