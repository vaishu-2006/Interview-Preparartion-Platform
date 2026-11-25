const express = require('express');
const discussionController = require('../controllers/discussionController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/:slug', protect, discussionController.listComments);
router.post('/:slug', protect, discussionController.createComment);
router.delete('/comment/:id', protect, discussionController.deleteComment);

module.exports = router;
