const express = require('express');
const dataExportController = require('../controllers/dataExportController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/export', protect, dataExportController.exportMyData);

module.exports = router;
