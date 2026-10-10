import { apiRequest } from './api';

export const fetchOverview = () => apiRequest('/analytics/overview');
export const fetchWeekly = () => apiRequest('/analytics/weekly');
export const fetchSubjectBreakdown = () => apiRequest('/analytics/subjects');
