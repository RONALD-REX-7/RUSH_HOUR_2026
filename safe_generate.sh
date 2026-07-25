#!/bin/bash

# Auth API
cat << 'INNER_EOF' > src/services/authApi.ts
import api from './api';
import { Role, User } from '../types';
export const authApi = {
  async login(role: Role, email?: string): Promise<{ token: string; user: User }> {
    const res = await api.post('/auth/login', { role, email });
    if (res.data.token) localStorage.setItem('pc_jwt_token', res.data.token);
    return res.data;
  },
  async getHealth() {
    try { const res = await api.get('/health'); return res.data; } catch { return { status: 'offline' }; }
  }
};
INNER_EOF

# Citizen API
cat << 'INNER_EOF' > src/services/citizenApi.ts
import api from './api';
import { Problem } from '../types';
export const citizenApi = {
  async fetchProblems(): Promise<Problem[]> {
    const res = await api.get('/citizen/problems');
    return res.data;
  },
  async createProblem(data: Partial<Problem>): Promise<Problem> {
    const res = await api.post('/citizen/problems', data);
    return res.data;
  },
  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    const res = await api.put(`/citizen/problems/${id}`, data);
    return res.data;
  },
  async deleteProblem(id: string): Promise<boolean> {
    const res = await api.delete(`/citizen/problems/${id}`);
    return res.data.success;
  },
  async submitRating(id: string, rating: number, feedback: string): Promise<Problem> {
    const res = await api.post(`/citizen/problems/${id}/rating`, { rating, feedback });
    return res.data;
  }
};
INNER_EOF

# Entrepreneur API
cat << 'INNER_EOF' > src/services/entrepreneurApi.ts
import api from './api';
import { Problem } from '../types';
export const entrepreneurApi = {
  async acceptProblem(id: string, entrepreneurId: string): Promise<Problem> {
    const res = await api.put(`/entrepreneur/problems/${id}/accept`, { entrepreneurId });
    return res.data;
  }
};
INNER_EOF

# Admin API
cat << 'INNER_EOF' > src/services/adminApi.ts
import api from './api';
import { Problem } from '../types';
export const adminApi = {
  async assignEntrepreneur(id: string, entrepreneurId: string): Promise<Problem> {
    const res = await api.put(`/admin/problems/${id}/assign`, { entrepreneurId });
    return res.data;
  }
};
INNER_EOF

# Chat API
cat << 'INNER_EOF' > src/services/chatApi.ts
import api from './api';
import { ChatMessage } from '../types';
export const chatApi = {
  async fetchChats(): Promise<ChatMessage[]> {
    const res = await api.get('/chats');
    return res.data;
  },
  async sendChatMessage(data: Partial<ChatMessage>): Promise<ChatMessage> {
    const res = await api.post('/chats', data);
    return res.data;
  }
};
INNER_EOF

# Notification API
cat << 'INNER_EOF' > src/services/notificationApi.ts
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
INNER_EOF
