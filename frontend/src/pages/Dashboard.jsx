import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarClock, CheckCircle2, Clock3, Plus, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchOverview, fetchSubjectBreakdown, fetchWeekly } from '../services/analyticsService';
import { fetchTasks, updateTask } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState({});
  const [weekly, setWeekly] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchOverview(),
      fetchWeekly(),
      fetchSubjectBreakdown(),
      fetchTasks({ limit: 5, sort: 'dueDate' }),
    ])
      .then(([overviewRes, weeklyRes, subjectRes, taskRes]) => {
        setOverview(overviewRes.overview || {});
        setWeekly(weeklyRes.weekly || []);
        setSubjects(subjectRes.breakdown || []);
        setTasks(taskRes.tasks || []);
      })
      .catch(() => {
        setOverview({});
        setWeekly([]);
        setTasks([]);
        setSubjects([]);
      });
  }, []);

  async function handleTaskToggle(task) {
    await updateTask(task._id, { status: task.status === 'completed' ? 'todo' : 'completed' });
    const refreshed = await fetchTasks({ limit: 5, sort: 'dueDate' });
    setTasks(refreshed.tasks || []);
  }

  const metricCards = useMemo(
    () => [
      { label: 'Tasks due today', value: overview.dueToday ?? 0, icon: Clock3 },
      { label: 'Completed this week', value: weekly.reduce((sum, item) => sum + (item.completed || 0), 0), icon: CheckCircle2 },
      { label: 'Upcoming deadlines', value: tasks.filter((task) => task.status !== 'completed').length, icon: CalendarClock },
      { label: 'Completion rate', value: `${overview.completionRate ?? 0}%`, icon: Target },
    ],
    [overview, weekly, tasks]
  );

  return (
    <div className="grid">
      <div className="header-row">
        <div>
          <h1 className="page-title">Good morning, {user?.name || 'Student'}.</h1>
          <p className="muted">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>

        <div className="header-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/tasks')}>
            <Plus size={16} /> Add Task
          </button>
          <button type="button" className="primary-btn">
            Schedule session
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {metricCards.map(({ label, value, icon: Icon }) => (
          <div className="card" key={label}>
            <div className="card-topline">
              <div>
                <div className="small-label">{label}</div>
                <div className="metric-value">{value}</div>
              </div>
              <div className="icon-box"><Icon size={18} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="header-row">
            <h2>Today&apos;s tasks</h2>
            <Link to="/tasks">View all tasks</Link>
          </div>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">No tasks are scheduled yet.</div>
            ) : (
              tasks.map((task) => (
                <div className="task-item" key={task._id}>
                  <div>
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">{task.subject?.name || 'General'} • {task.priority}</div>
                    <small>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}</small>
                  </div>

                  <div className="task-actions">
                    <span className={`priority-pill priority-${task.priority || 'medium'}`}>{task.priority}</span>
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleTaskToggle(task)}
                      aria-label={`Toggle ${task.title}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2>Upcoming deadlines</h2>
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">No upcoming deadlines.</div>
            ) : (
              tasks.map((task) => (
                <div className="mini-item" key={`${task._id}-deadline`}>
                  <div>
                    <strong>{task.title}</strong>
                    <div className="task-meta">{task.subject?.name || 'General'}</div>
                  </div>
                  <span className={`priority-pill priority-${task.priority || 'medium'}`}>{task.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h2>Weekly productivity</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="createdFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.12} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="created" stroke="#6C63FF" fill="url(#createdFill)" />
                <Area type="monotone" dataKey="completed" stroke="#22A06B" fill="#E7F9EF" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Subject progress</h2>
          <div className="task-list">
            {subjects.length === 0 ? (
              <div className="empty-state">No subject data yet.</div>
            ) : (
              subjects.map((subject) => (
                <div key={subject._id} className="subject-progress">
                  <div className="subject-progress-head">
                    <strong>{subject.name}</strong>
                    <span>{subject.completedTasks}/{subject.totalTasks}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${subject.progress}%`, background: subject.color || '#6C63FF' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
