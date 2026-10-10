const Subject = require('../models/Subject');
const Task = require('../models/Task');
const Note = require('../models/Note');

async function listSubjects(req, res) {
  const { search, sort = 'name' } = req.query;
  const filters = { owner: req.user._id };

  if (search) {
    filters.$or = [
      { name: { $regex: String(search), $options: 'i' } },
      { code: { $regex: String(search), $options: 'i' } },
    ];
  }

  const subjects = await Subject.find(filters).sort(sort === 'createdAt' ? { createdAt: -1 } : { name: 1 });
  return res.json({ subjects });
}

async function getSubjectById(req, res) {
  const subject = await Subject.findOne({ _id: req.params.id, owner: req.user._id });
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' });
  }

  const relatedTasks = await Task.find({ owner: req.user._id, subject: subject._id });
  const noteCount = await Note.countDocuments({ owner: req.user._id, subject: subject._id });
  return res.json({ subject, relatedTasks, noteCount });
}

async function createSubject(req, res) {
  const { name, code, description, color, semester } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Subject name is required.' });
  }

  const existing = await Subject.findOne({ owner: req.user._id, name: String(name).trim() });
  if (existing) {
    return res.status(409).json({ message: 'A subject with that name already exists.' });
  }

  const subject = await Subject.create({
    owner: req.user._id,
    name: String(name).trim(),
    code: code ? String(code).trim() : '',
    description: description ? String(description).trim() : '',
    color: color || '#6C63FF',
    semester: semester ? String(semester).trim() : '',
  });

  return res.status(201).json({ subject });
}

async function updateSubject(req, res) {
  const subject = await Subject.findOne({ _id: req.params.id, owner: req.user._id });
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' });
  }

  const { name, code, description, color, semester } = req.body;

  if (name && String(name).trim() !== subject.name) {
    const duplicate = await Subject.findOne({ owner: req.user._id, name: String(name).trim() });
    if (duplicate && duplicate._id.toString() !== subject._id.toString()) {
      return res.status(409).json({ message: 'A subject with that name already exists.' });
    }
  }

  if (name !== undefined) subject.name = String(name).trim();
  if (code !== undefined) subject.code = String(code).trim();
  if (description !== undefined) subject.description = String(description).trim();
  if (color) subject.color = color;
  if (semester !== undefined) subject.semester = String(semester).trim();

  await subject.save();
  return res.json({ subject });
}

async function deleteSubject(req, res) {
  const subject = await Subject.findOne({ _id: req.params.id, owner: req.user._id });
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' });
  }

  await Task.updateMany({ owner: req.user._id, subject: subject._id }, { $set: { subject: null } });
  await Note.updateMany({ owner: req.user._id, subject: subject._id }, { $set: { subject: null } });
  await subject.deleteOne();

  return res.json({ message: 'Subject deleted and related records were unassigned.' });
}

module.exports = { listSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };
