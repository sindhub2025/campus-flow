import { apiRequest } from './api';

export const fetchTasks = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/tasks${query ? `?${query}` : ''}`);
};

export const createTask = (payload) => apiRequest('/tasks', { method: 'POST', body: JSON.stringify(payload) });
export const updateTask = (id, payload) => apiRequest(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteTask = (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' });
