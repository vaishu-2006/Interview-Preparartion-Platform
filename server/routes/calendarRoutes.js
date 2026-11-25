const express = require('express');
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/export.ics', protect, calendarController.exportIcs);

module.exports = router;
