const express = require('express');
const placementDriveController = require('../controllers/placementDriveController');
const { protect } = require('../middlewares/auth');
const uploadResume = require('../middlewares/uploadResume');

const router = express.Router();

router.post('/', protect, placementDriveController.startDrive);
router.get('/active', protect, placementDriveController.getActiveDrive);
router.get('/', protect, placementDriveController.getDrives);
router.get('/:driveId', protect, placementDriveController.getDrive);
router.post('/:driveId/abandon', protect, placementDriveController.abandonDrive);

router.post(
  '/:driveId/resume-screening',
  protect,
  uploadResume.single('resumeFile'),
  placementDriveController.runResumeScreening
);

router.post('/:driveId/online-assessment/start', protect, placementDriveController.startAssessment);
router.post('/:driveId/online-assessment/sync', protect, placementDriveController.syncAssessment);

router.post('/:driveId/technical-interview/start', protect, placementDriveController.startTechnicalInterview);
router.post('/:driveId/technical-interview/sync', protect, placementDriveController.syncTechnicalInterview);

router.post('/:driveId/hr-interview/start', protect, placementDriveController.startHrInterview);
router.post('/:driveId/hr-interview/sync', protect, placementDriveController.syncHrInterview);

router.post('/:driveId/interview-stage/sync', protect, placementDriveController.syncCurrentInterviewStage);

router.post('/:driveId/finalize', protect, placementDriveController.finalize);
router.get('/:driveId/report/pdf', protect, placementDriveController.getDriveReportPdf);

module.exports = router;
