const StudySession = require('../models/StudySession');
const Subject = require('../models/Subject');

async function listSessions(req, res) {
  const { status, subject } = req.query;
  const filters = { owner: req.user._id };

  if (status) filters.status = status;
  if (subject) filters.subject = subject;

  const sessions = await StudySession.find(filters).populate('subject', 'name color').sort({ startTime: 1 });
  return res.json({ sessions });
}

async function createSession(req, res) {
  const { subject, title, startTime, plannedDurationMinutes, status, reflection } = req.body;

  if (!title || !startTime) {
    return res.status(400).json({ message: 'Title and start time are required.' });
  }

  if (subject) {
    const existingSubject = await Subject.findOne({ _id: subject, owner: req.user._id });
    if (!existingSubject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
  }

  const session = await StudySession.create({
    owner: req.user._id,
    subject: subject || null,
    title: String(title).trim(),
    startTime: new Date(startTime),
    plannedDurationMinutes: Number(plannedDurationMinutes || 60),
    status: status || 'scheduled',
    reflection: reflection ? String(reflection).trim() : '',
  });

  return res.status(201).json({ session });
}

async function updateSession(req, res) {
  const session = await StudySession.findOne({ _id: req.params.id, owner: req.user._id });
  if (!session) {
    return res.status(404).json({ message: 'Session not found.' });
  }

  const { title, subject, plannedDurationMinutes, status, reflection, endTime, actualDurationMinutes } = req.body;

  if (title !== undefined) session.title = String(title).trim();
  if (subject !== undefined) session.subject = subject || null;
  if (plannedDurationMinutes !== undefined) session.plannedDurationMinutes = Number(plannedDurationMinutes);
  if (status !== undefined) session.status = status;
  if (reflection !== undefined) session.reflection = String(reflection).trim();
  if (endTime !== undefined) session.endTime = endTime ? new Date(endTime) : null;
  if (actualDurationMinutes !== undefined) session.actualDurationMinutes = Number(actualDurationMinutes || 0);

  await session.save();
  await session.populate('subject', 'name color');
  return res.json({ session });
}

async function deleteSession(req, res) {
  const session = await StudySession.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!session) {
    return res.status(404).json({ message: 'Session not found.' });
  }

  return res.json({ message: 'Study session deleted successfully.' });
}

module.exports = { listSessions, createSession, updateSession, deleteSession };
