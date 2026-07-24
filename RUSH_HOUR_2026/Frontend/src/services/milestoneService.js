import api from './api';

export const createMilestone = (opportunityId, data) => api.post(`/milestones/${opportunityId}`, data);
export const getMilestones = (opportunityId) => api.get(`/milestones/${opportunityId}`);
export const updateMilestone = (id, data) => api.put(`/milestones/${id}`, data);
export const completeMilestone = (id, data) => api.post(`/milestones/${id}/complete`, data);
