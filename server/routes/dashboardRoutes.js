const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, dashboardController.getDashboard);
router.put('/update', protect, dashboardController.updateDashboard);

module.exports = router;
