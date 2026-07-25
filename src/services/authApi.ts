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
