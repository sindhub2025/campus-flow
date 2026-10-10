import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { createSubject, deleteSubject, fetchSubjects, updateSubject } from '../services/subjectService';

const emptyForm = { name: '', code: '', color: '#6C63FF', semester: '', description: '' };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadSubjects() {
    const response = await fetchSubjects();
    setSubjects(response.subjects || []);
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (editingId) {
        await updateSubject(editingId, form);
      } else {
        await createSubject(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadSubjects();
    } catch (err) {
      alert(err.message || 'Unable to save subject');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this subject and clear related assignments?')) return;
    await deleteSubject(id);
    await loadSubjects();
  }

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Subjects</h2>

        <div className="task-list">
          {subjects.length === 0 ? (
            <div className="empty-state">No subjects yet.</div>
          ) : (
            subjects.map((subject) => (
              <div className="task-item" key={subject._id}>
                <div className="subject-chip-wrap">
                  <span className="subject-dot" style={{ background: subject.color || '#6C63FF' }} />
                  <div>
                    <div className="task-title">{subject.name}</div>
                    <small>{subject.code || 'No code'} • {subject.semester || 'No semester'}</small>
                  </div>
                </div>

                <div className="inline-actions">
                  <button type="button" className="ghost-btn" onClick={() => { setEditingId(subject._id); setForm(subject); }}>
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => handleDelete(subject._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit subject' : 'New subject'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </div>

          <div className="two-col">
            <div className="field">
              <label>Code</label>
              <input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} />
            </div>
            <div className="field">
              <label>Semester</label>
              <input value={form.semester} onChange={(event) => setForm({ ...form, semester: event.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Color</label>
            <input type="color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {editingId ? 'Update subject' : 'Create subject'}
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
