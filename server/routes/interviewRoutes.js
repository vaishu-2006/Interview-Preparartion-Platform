const express = require('express');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middlewares/auth');
const uploadResume = require('../middlewares/uploadResume');

const router = express.Router();

router.post('/config', protect, uploadResume.single('resumeFile'), interviewController.createConfig);
router.post('/start', protect, interviewController.startSession);
router.get('/sessions', protect, interviewController.getSessions);
router.get('/reports', protect, interviewController.getReports);

router.get('/session/:sessionId', protect, interviewController.getSession);
router.post('/session/:sessionId/turn/:index/answer', protect, interviewController.answerTurn);
router.post('/session/:sessionId/turn/:index/skip', protect, interviewController.skipTurn);
router.post('/session/:sessionId/metrics', protect, interviewController.recordMetric);
router.post('/session/:sessionId/violation', protect, interviewController.recordViolation);
router.post('/session/:sessionId/complete', protect, interviewController.completeSession);
router.get('/session/:sessionId/report', protect, interviewController.getReport);
router.get('/session/:sessionId/report/pdf', protect, interviewController.getReportPdf);

module.exports = router;
