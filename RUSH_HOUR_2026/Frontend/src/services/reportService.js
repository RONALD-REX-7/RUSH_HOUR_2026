import api from './api';

export const createReport = (data) => api.post('/reports', data);
export const getReports = (params) => api.get('/reports', { params });
export const getReport = (id) => api.get(`/reports/${id}`);
export const updateReport = (id, data) => api.put(`/reports/${id}`, data);
export const deleteReport = (id) => api.delete(`/reports/${id}`);
export const upvoteReport = (id) => api.post(`/reports/${id}/upvote`);
export const getMyReports = () => api.get('/reports/me');
export const getNearbyReports = (lat, lng, radius) => api.get('/reports/nearby', { params: { lat, lng, radius } });
