import api from './api';

export const getOpportunities = (params) => api.get('/opportunities', { params });
export const getOpportunity = (id) => api.get(`/opportunities/${id}`);
export const getForMap = () => api.get('/opportunities/map');
export const getHeatmapData = () => api.get('/opportunities/heatmap');
