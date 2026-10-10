import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchOverview, fetchSubjectBreakdown, fetchWeekly } from '../services/analyticsService';

const colors = ['#6C63FF', '#22A06B', '#F0A43A', '#E05260', '#8A82FF'];

export default function Analytics() {
  const [overview, setOverview] = useState({});
  const [weekly, setWeekly] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    Promise.all([fetchOverview(), fetchWeekly(), fetchSubjectBreakdown()])
      .then(([overviewRes, weeklyRes, subjectRes]) => {
        setOverview(overviewRes.overview || {});
        setWeekly(weeklyRes.weekly || []);
        setSubjects(subjectRes.breakdown || []);
      })
      .catch(() => {
        setOverview({});
        setWeekly([]);
        setSubjects([]);
      });
  }, []);

  const pieData = subjects.map((subject) => ({ name: subject.name, value: subject.totalTasks }));

  return (
    <div className="grid">
      <div className="stats-grid">
        <div className="card">
          <div className="small-label">Completion rate</div>
          <div className="metric-value">{overview.completionRate ?? 0}%</div>
        </div>
        <div className="card">
          <div className="small-label">Overdue tasks</div>
          <div className="metric-value">{overview.overdueTasks ?? 0}</div>
        </div>
        <div className="card">
          <div className="small-label">Completed tasks</div>
          <div className="metric-value">{overview.completedTasks ?? 0}</div>
        </div>
        <div className="card">
          <div className="small-label">Study minutes</div>
          <div className="metric-value">{overview.studyMinutesThisWeek ?? 0}</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <h2>Weekly task completion</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="created" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#22A06B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Subject distribution</h2>
          <div className="chart-wrap small-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={70}>
                  {pieData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
