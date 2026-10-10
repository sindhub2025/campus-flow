const Task = require('../models/Task');
const StudySession = require('../models/StudySession');
const Subject = require('../models/Subject');
const { subDays, startOfDay, format } = require('date-fns');

async function getOverview(req, res) {
  const tasks = await Task.find({ owner: req.user._id });
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = tasks.filter((task) => task.status !== 'completed').length;
  const overdue = tasks.filter(
    (task) => task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date()
  ).length;
  const dueToday = tasks.filter((task) => {
    if (!task.dueDate) return false;
    return startOfDay(new Date(task.dueDate)).getTime() === startOfDay(new Date()).getTime();
  }).length;

  const weekSessions = await StudySession.find({
    owner: req.user._id,
    startTime: { $gte: subDays(new Date(), 6) },
  });
  const studyMinutes = weekSessions.reduce(
    (sum, session) => sum + (session.actualDurationMinutes || session.plannedDurationMinutes || 0),
    0
  );

  return res.json({
    overview: {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      dueToday,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      studyMinutesThisWeek: studyMinutes,
    },
  });
}

async function getWeekly(req, res) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
    };
  });

  const tasks = await Task.find({
    owner: req.user._id,
    createdAt: { $gte: subDays(new Date(), 6) },
  });

  const weekly = days.map((day) => {
    const start = new Date(day.date);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const created = tasks.filter((task) => {
      const createdAt = new Date(task.createdAt);
      return createdAt >= start && createdAt <= end;
    }).length;

    const completed = tasks.filter((task) => {
      const updated = new Date(task.updatedAt);
      return task.status === 'completed' && startOfDay(updated).getTime() === startOfDay(start).getTime();
    }).length;

    return { ...day, created, completed };
  });

  return res.json({ weekly });
}

async function getSubjectBreakdown(req, res) {
  const subjects = await Subject.find({ owner: req.user._id });

  const breakdown = await Promise.all(
    subjects.map(async (subject) => {
      const tasks = await Task.find({ owner: req.user._id, subject: subject._id });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.status === 'completed').length;

      return {
        _id: subject._id,
        name: subject.name,
        color: subject.color,
        totalTasks,
        completedTasks,
        progress: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      };
    })
  );

  return res.json({ breakdown });
}

module.exports = { getOverview, getWeekly, getSubjectBreakdown };
