const express = require('express');
const flashcardController = require('../controllers/flashcardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, flashcardController.listCards);
router.post('/', protect, flashcardController.createCard);
router.get('/due', protect, flashcardController.getDueCards);
router.get('/stats', protect, flashcardController.getStats);
router.put('/:id', protect, flashcardController.updateCard);
router.delete('/:id', protect, flashcardController.deleteCard);
router.post('/:id/review', protect, flashcardController.reviewCard);

module.exports = router;
