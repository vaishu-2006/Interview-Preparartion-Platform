const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/branches', protect, dashboardController.getBranchOptions);
router.post('/save-course', protect, dashboardController.saveCourse);
router.post('/save-branch', protect, dashboardController.saveBranch);

module.exports = router;
