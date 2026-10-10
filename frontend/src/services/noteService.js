import { apiRequest } from './api';

export const fetchNotes = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/notes${query ? `?${query}` : ''}`);
};

export const createNote = (payload) => apiRequest('/notes', { method: 'POST', body: JSON.stringify(payload) });
export const updateNote = (id, payload) => apiRequest(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteNote = (id) => apiRequest(`/notes/${id}`, { method: 'DELETE' });
