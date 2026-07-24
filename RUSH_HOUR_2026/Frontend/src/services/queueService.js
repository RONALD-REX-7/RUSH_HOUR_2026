import api from './api';

export const joinQueue = (opportunityId, data) => api.post(`/queues/join/${opportunityId}`, data);
export const getQueue = (opportunityId) => api.get(`/queues/${opportunityId}`);
export const getMyQueues = () => api.get('/queues/me');
export const acceptOpportunity = (opportunityId) => api.post(`/queues/accept/${opportunityId}`);
export const declineOpportunity = (opportunityId) => api.post(`/queues/decline/${opportunityId}`);
export const leaveQueue = (opportunityId) => api.post(`/queues/leave/${opportunityId}`);
