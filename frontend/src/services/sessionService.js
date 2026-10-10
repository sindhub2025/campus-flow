import { apiRequest } from './api';

export const fetchSessions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/study-sessions${query ? `?${query}` : ''}`);
};

export const createSession = (payload) => apiRequest('/study-sessions', { method: 'POST', body: JSON.stringify(payload) });
export const updateSession = (id, payload) => apiRequest(`/study-sessions/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteSession = (id) => apiRequest(`/study-sessions/${id}`, { method: 'DELETE' });
