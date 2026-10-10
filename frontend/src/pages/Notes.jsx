import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { createNote, deleteNote, fetchNotes, updateNote } from '../services/noteService';

const emptyForm = { title: '', body: '', tags: '' };

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadNotes() {
    const response = await fetchNotes();
    setNotes(response.notes || []);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const payload = {
        title: form.title,
        body: form.body,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (editingId) {
        await updateNote(editingId, payload);
      } else {
        await createNote(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadNotes();
    } catch (err) {
      alert(err.message || 'Unable to save note');
    }
  }

  async function handleDelete(id) {
    await deleteNote(id);
    await loadNotes();
  }

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Notes</h2>

        {notes.length === 0 ? (
          <div className="empty-state">No notes created yet.</div>
        ) : (
          <div className="task-list">
            {notes.map((note) => (
              <div className="task-item" key={note._id}>
                <div>
                  <div className="task-title">{note.title}</div>
                  <div className="task-meta">{note.body || 'No content yet.'}</div>
                  {note.tags?.length ? <small>{note.tags.join(', ')}</small> : null}
                </div>

                <div className="inline-actions">
                  <button type="button" className="ghost-btn" onClick={() => { setEditingId(note._id); setForm({ title: note.title, body: note.body, tags: (note.tags || []).join(', ') }); }}>
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="ghost-btn" onClick={() => handleDelete(note._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit note' : 'New note'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </div>

          <div className="field">
            <label>Body</label>
            <textarea rows={5} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
          </div>

          <div className="field">
            <label>Tags</label>
            <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">{editingId ? 'Update note' : 'Create note'}</button>
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
