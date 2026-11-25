const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, profileController.getFullProfile);
router.put('/update', protect, profileController.updateFullProfile);

module.exports = router;
