const StudyTask = require('../models/StudyTask');
const ApiError = require('../utils/ApiError');

const listTasks = (userId) => StudyTask.find({ userId }).sort({ done: 1, dueDate: 1 });

const createTask = async (userId, { title, dueDate, notes }) => {
  if (!title?.trim()) {
    throw new ApiError(422, 'title is required');
  }
  return StudyTask.create({
    userId,
    title: title.trim(),
    dueDate: dueDate ? new Date(dueDate) : undefined,
    notes: notes || '',
  });
};

const updateTask = async (userId, id, updates) => {
  const allowed = ['title', 'dueDate', 'notes', 'done'];
  const payload = {};
  allowed.forEach((field) => {
    if (updates[field] !== undefined) payload[field] = updates[field];
  });

  const task = await StudyTask.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  return task;
};

const deleteTask = async (userId, id) => {
  const task = await StudyTask.findOneAndDelete({ _id: id, userId });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
};

module.exports = { listTasks, createTask, updateTask, deleteTask };
