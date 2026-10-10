const Note = require('../models/Note');
const Subject = require('../models/Subject');

async function listNotes(req, res) {
  const { search, subject, tag } = req.query;
  const filters = { owner: req.user._id };

  if (subject) filters.subject = subject;
  if (tag) filters.tags = tag;

  if (search) {
    filters.$or = [
      { title: { $regex: String(search), $options: 'i' } },
      { body: { $regex: String(search), $options: 'i' } },
    ];
  }

  const notes = await Note.find(filters).populate('subject', 'name color').sort({ updatedAt: -1 });
  return res.json({ notes });
}

async function getNoteById(req, res) {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id }).populate('subject', 'name color');
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  return res.json({ note });
}

async function createNote(req, res) {
  const { title, body, subject, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Note title is required.' });
  }

  if (subject) {
    const existingSubject = await Subject.findOne({ _id: subject, owner: req.user._id });
    if (!existingSubject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
  }

  const note = await Note.create({
    owner: req.user._id,
    title: String(title).trim(),
    body: body ? String(body).trim() : '',
    subject: subject || null,
    tags: Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
  });

  return res.status(201).json({ note });
}

async function updateNote(req, res) {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  const { title, body, subject, tags } = req.body;

  if (title !== undefined) note.title = String(title).trim();
  if (body !== undefined) note.body = String(body).trim();
  if (subject !== undefined) note.subject = subject || null;
  if (tags !== undefined) note.tags = Array.isArray(tags) ? tags.map((tag) => String(tag).trim()).filter(Boolean) : [];

  await note.save();
  await note.populate('subject', 'name color');
  return res.json({ note });
}

async function deleteNote(req, res) {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  return res.json({ message: 'Note deleted successfully.' });
}

module.exports = { listNotes, getNoteById, createNote, updateNote, deleteNote };
