const express = require('express');
const jobApplicationController = require('../controllers/jobApplicationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, jobApplicationController.listApplications);
router.post('/', protect, jobApplicationController.createApplication);
router.put('/:id', protect, jobApplicationController.updateApplication);
router.delete('/:id', protect, jobApplicationController.deleteApplication);

module.exports = router;
