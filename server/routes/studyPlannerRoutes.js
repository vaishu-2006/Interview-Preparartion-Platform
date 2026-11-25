const express = require('express');
const studyPlannerController = require('../controllers/studyPlannerController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, studyPlannerController.listTasks);
router.post('/', protect, studyPlannerController.createTask);
router.put('/:id', protect, studyPlannerController.updateTask);
router.delete('/:id', protect, studyPlannerController.deleteTask);

module.exports = router;
