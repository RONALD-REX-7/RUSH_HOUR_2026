import { User, Role, Problem, ProblemStatus, ChatMessage, NotificationItem } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pc_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Health check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth
  async login(role: Role, email?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('pc_jwt_token', data.token);
    }
    return data;
  },

  // Problems
  async fetchProblems(): Promise<Problem[]> {
    try {
      const res = await fetch(`${API_BASE}/problems`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('Failed to fetch problems');
      return await res.json();
    } catch (err) {
      console.warn('API fetchProblems failed, using local cache:', err);
      return [];
    }
  },

  async createProblem(problemData: Partial<Problem>): Promise<Problem> {
    const res = await fetch(`${API_BASE}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(problemData),
    });
    return await res.json();
  },

  async updateProblem(id: string, updatedData: Partial<Problem>): Promise<Problem> {
    const res = await fetch(`${API_BASE}/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  },

  async deleteProblem(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/problems/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    return data.success;
  },

  async assignEntrepreneur(problemId: string, entrepreneurId: string): Promise<Problem> {
    const res = await fetch(`${API_BASE}/problems/${problemId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ entrepreneurId }),
    });
    return await res.json();
  },

  async submitRating(problemId: string, rating: number, feedback: string): Promise<Problem> {
    const res = await fetch(`${API_BASE}/problems/${problemId}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ rating, feedback }),
    });
    return await res.json();
  },

  // Chats
  async fetchChats(): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/chats`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('Failed to fetch chats');
      return await res.json();
    } catch (err) {
      console.warn('API fetchChats failed:', err);
      return [];
    }
  },

  async sendChatMessage(messageData: Partial<ChatMessage>): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(messageData),
    });
    return await res.json();
  },

  // Notifications
  async fetchNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    } catch (err) {
      console.warn('API fetchNotifications failed:', err);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/user/${userId}/read-all`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
  },
};
