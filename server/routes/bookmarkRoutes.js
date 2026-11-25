const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, bookmarkController.listBookmarks);
router.post('/', protect, bookmarkController.createBookmark);
router.delete('/:id', protect, bookmarkController.deleteBookmark);

module.exports = router;
