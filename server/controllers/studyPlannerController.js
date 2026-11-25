const asyncHandler = require('../utils/asyncHandler');
const studyPlannerService = require('../services/studyPlannerService');

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await studyPlannerService.listTasks(req.user._id);
  res.status(200).json({ success: true, tasks });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await studyPlannerService.createTask(req.user._id, req.body);
  res.status(201).json({ success: true, task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await studyPlannerService.updateTask(req.user._id, req.params.id, req.body);
  res.status(200).json({ success: true, task });
});

const deleteTask = asyncHandler(async (req, res) => {
  await studyPlannerService.deleteTask(req.user._id, req.params.id);
  res.status(200).json({ success: true, message: 'Task removed' });
});

module.exports = { listTasks, createTask, updateTask, deleteTask };
