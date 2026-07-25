import api from './api';
import { Problem } from '../types';

export const adminApi = {
  async assignEntrepreneur(id: string, entrepreneurId: string): Promise<Problem> {
    const res = await api.post(`/problems/${id}/assign`, { entrepreneurId });
    return res.data;
  }
};
