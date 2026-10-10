const mongoose = require('mongoose');
const Task = require('../models/Task');
const Subject = require('../models/Subject');

function getSort(sortKey) {
  const sortMap = {
    dueDate: { dueDate: 1, createdAt: -1 },
    createdAt: { createdAt: -1 },
    priority: { priority: -1 },
    title: { title: 1 },
  };

  return sortMap[sortKey] || { dueDate: 1, createdAt: -1 };
}

function normalizePayload(payload = {}) {
  return {
    title: payload.title ? String(payload.title).trim() : undefined,
    description: payload.description !== undefined ? String(payload.description).trim() : '',
    category: payload.category ? String(payload.category).trim() : 'General',
    priority: payload.priority || 'medium',
    status: payload.status || 'todo',
    subject: payload.subject || null,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    dueTime: payload.dueTime ? String(payload.dueTime).trim() : '',
  };
}

async function listTasks(req, res) {
  const { status, priority, subject, search, sort = 'dueDate', page = 1, limit = 20 } = req.query;
  const filters = { owner: req.user._id };

  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (subject) filters.subject = subject;

  if (search) {
    filters.$or = [
      { title: { $regex: String(search), $options: 'i' } },
      { description: { $regex: String(search), $options: 'i' } },
    ];
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 20;

  const tasks = await Task.find(filters)
    .populate('subject', 'name color')
    .sort(getSort(sort))
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const total = await Task.countDocuments(filters);

  return res.json({ tasks, total, page: pageNumber, totalPages: Math.max(1, Math.ceil(total / limitNumber)) });
}

async function getTaskById(req, res) {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate('subject', 'name color');
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json({ task });
}

async function createTask(req, res) {
  const payload = normalizePayload(req.body);

  if (!payload.title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  if (payload.subject && !mongoose.Types.ObjectId.isValid(payload.subject)) {
    return res.status(400).json({ message: 'Invalid subject id.' });
  }

  if (payload.subject) {
    const subject = await Subject.findOne({ _id: payload.subject, owner: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
  }

  const task = await Task.create({ ...payload, owner: req.user._id });
  return res.status(201).json({ task });
}

async function updateTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const payload = normalizePayload(req.body);

  if (payload.title && !payload.title.trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  if (payload.subject && !mongoose.Types.ObjectId.isValid(payload.subject)) {
    return res.status(400).json({ message: 'Invalid subject id.' });
  }

  if (payload.subject) {
    const subject = await Subject.findOne({ _id: payload.subject, owner: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
  }

  Object.assign(task, payload);
  await task.save();
  await task.populate('subject', 'name color');

  return res.json({ task });
}

async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  return res.json({ message: 'Task deleted successfully.' });
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask };
