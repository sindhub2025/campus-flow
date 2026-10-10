import { useEffect, useMemo, useState } from 'react';
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { fetchSessions } from '../services/sessionService';
import { fetchTasks } from '../services/taskService';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    Promise.all([fetchTasks({ limit: 100 }), fetchSessions()])
      .then(([taskRes, sessionRes]) => {
        setTasks(taskRes.tasks || []);
        setSessions(sessionRes.sessions || []);
      })
      .catch(() => {
        setTasks([]);
        setSessions([]);
      });
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    const days = [];
    let cursor = startDate;

    while (cursor <= endDate) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }

    return days;
  }, [startDate, endDate]);

  function getDateEvents(date) {
    return {
      tasks: tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), date)),
      sessions: sessions.filter((session) => session.startTime && isSameDay(new Date(session.startTime), date)),
    };
  }

  return (
    <div className="card">
      <div className="header-row">
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>

        <div className="header-actions">
          <button type="button" className="ghost-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>Prev</button>
          <button type="button" className="ghost-btn" onClick={() => setCurrentMonth(new Date())}>Today</button>
          <button type="button" className="ghost-btn" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>Next</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="calendar-day-label">{day}</div>
        ))}

        {calendarDays.map((date) => {
          const events = getDateEvents(date);

          return (
            <div key={date.toISOString()} className={`calendar-cell ${isSameMonth(date, currentMonth) ? '' : 'muted-cell'}`}>
              <div className="calendar-date">{format(date, 'd')}</div>

              {events.tasks.slice(0, 2).map((task) => (
                <div className="calendar-tag task-tag" key={task._id}>{task.title}</div>
              ))}

              {events.sessions.slice(0, 1).map((session) => (
                <div className="calendar-tag session-tag" key={session._id}>{session.title}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
