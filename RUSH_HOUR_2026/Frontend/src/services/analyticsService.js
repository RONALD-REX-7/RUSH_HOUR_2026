import api from './api';

export const getOverview = () => api.get('/analytics/overview');
export const getReportsByCategory = () => api.get('/analytics/reports-by-category');
export const getDemandByRegion = () => api.get('/analytics/demand-by-region');
export const getOpportunityTrends = () => api.get('/analytics/opportunity-trends');
export const getPublicStats = () => api.get('/analytics/public-stats');
