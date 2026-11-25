const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Student-facing reads — any authenticated user.
router.get('/my-assignments', protect, adminController.listMyAssignments);
router.get('/events/active', protect, adminController.listActiveEvents);

// Faculty + admin.
router.get('/students', protect, requireRole('faculty', 'admin'), adminController.listStudents);
router.post('/assign-problem', protect, requireRole('faculty', 'admin'), adminController.assignProblem);
router.post('/events', protect, requireRole('faculty', 'admin'), adminController.createEvent);
router.get('/events', protect, requireRole('faculty', 'admin'), adminController.listEvents);
router.post('/award-points', protect, requireRole('faculty', 'admin'), adminController.awardPoints);
router.get('/cohort-analytics', protect, requireRole('faculty', 'admin'), adminController.getCohortAnalytics);
router.get('/code-similarity', protect, requireRole('faculty', 'admin'), adminController.checkCodeSimilarity);

// Admin only.
router.get('/stats', protect, requireRole('admin'), adminController.getStats);

module.exports = router;
