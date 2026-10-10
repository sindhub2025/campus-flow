import { useEffect, useState } from 'react';
import { CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService';

const emptyForm = {
  title: '',
  description: '',
  subject: '',
  dueDate: '',
  dueTime: '',
  priority: 'medium',
  status: 'todo',
  category: 'General',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetchTasks({ search, sort: 'dueDate', limit: 50 });
      setTasks(response.tasks || []);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [search]);

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = { ...form };
    if (!payload.title.trim()) return;

    try {
      if (editingId) {
        await updateTask(editingId, payload);
      } else {
        await createTask(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      alert(err.message || 'Unable to save task');
    }
  }

  function handleAddTask() {
    setEditingId(null);
    setForm(emptyForm);
    document.querySelector('.form input')?.focus();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    await loadTasks();
  }

  async function handleComplete(task) {
    await updateTask(task._id, { status: task.status === 'completed' ? 'todo' : 'completed' });
    await loadTasks();
  }

  return (
    <div className="content-grid">
      <div className="card">
        <div className="header-row">
          <h2>Task board</h2>
          <button type="button" className="primary-btn" onClick={handleAddTask}>
            <Plus size={16} /> Add task
          </button>
        </div>

        <div className="input-row" style={{ marginTop: 16 }}>
          <input
            className="search-field"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks"
          />
        </div>

        {loading ? (
          <div className="loader">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks created yet.</div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task._id}>
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">{task.description || 'No description'} </div>
                  <small>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'} • {task.category}</small>
                </div>

                <div className="task-actions">
                  <span className={`priority-pill priority-${task.priority || 'medium'}`}>{task.priority}</span>
                  <span className={`status-pill status-${task.status || 'todo'}`}>{task.status}</span>
                  <div className="inline-actions">
                    <button type="button" className="ghost-btn" onClick={() => setEditingId(task._id)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="ghost-btn" onClick={() => handleComplete(task)}>
                      <CheckCircle2 size={14} />
                    </button>
                    <button type="button" className="ghost-btn" onClick={() => handleDelete(task._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit task' : 'Create task'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>

          <div className="two-col">
            <div className="field">
              <label>Priority</label>
              <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div className="field">
              <label>Due date</label>
              <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            </div>

            <div className="field">
              <label>Due time</label>
              <input type="time" value={form.dueTime} onChange={(event) => setForm({ ...form, dueTime: event.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Category</label>
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? 'Save changes' : 'Create task'}
            </button>
            {editingId && (
              <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
