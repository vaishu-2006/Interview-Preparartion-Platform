const express = require('express');
const referralController = require('../controllers/referralController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, referralController.listPosts);
router.post('/', protect, referralController.createPost);
router.delete('/:id', protect, referralController.deletePost);

module.exports = router;
