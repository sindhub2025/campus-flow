import { apiRequest } from './api';

export const fetchSubjects = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/subjects${query ? `?${query}` : ''}`);
};

export const createSubject = (payload) => apiRequest('/subjects', { method: 'POST', body: JSON.stringify(payload) });
export const updateSubject = (id, payload) => apiRequest(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteSubject = (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' });
