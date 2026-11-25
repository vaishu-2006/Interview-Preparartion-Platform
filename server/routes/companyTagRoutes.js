const express = require('express');
const companyTagController = require('../controllers/companyTagController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/:slug', protect, companyTagController.listTags);
router.post('/:slug', protect, companyTagController.addTag);

module.exports = router;
