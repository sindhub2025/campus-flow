import { apiRequest } from './api';

export const register = (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const login = (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
export const me = () => apiRequest('/auth/me');
export const logout = () => apiRequest('/auth/logout', { method: 'POST' });
export const changePassword = (payload) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(payload) });
