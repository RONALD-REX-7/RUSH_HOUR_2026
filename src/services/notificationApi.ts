import api from './api';
import { NotificationItem } from '../types';

export const notificationApi = {
  async fetchNotifications(): Promise<NotificationItem[]> {
    const res = await api.get('/notifications');
    return res.data;
  },
  async markRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },
  async markAllRead(userId: string): Promise<void> {
    await api.put(`/notifications/user/${userId}/read-all`);
  }
};
