const express = require('express');
const resumeController = require('../controllers/resumeController');
const githubController = require('../controllers/githubController');
const { protect } = require('../middlewares/auth');
const uploadResume = require('../middlewares/uploadResume');

const router = express.Router();

router.get('/', protect, resumeController.getResume);
router.put('/update', protect, resumeController.updateResume);
router.delete('/', protect, resumeController.deleteResume);
router.get('/export-pdf', protect, resumeController.exportPdf);
router.post('/ats-check', protect, uploadResume.single('resumeFile'), resumeController.atsCheck);

router.get('/github/repos', protect, githubController.getRepos);
router.post('/github/import', protect, githubController.importRepos);

module.exports = router;
