import api from './api';
import { Problem } from '../types';

export const citizenApi = {
  async fetchProblems(): Promise<Problem[]> {
    const res = await api.get('/problems');
    return res.data;
  },
  async createProblem(data: Partial<Problem>): Promise<Problem> {
    const res = await api.post('/problems', data);
    return res.data;
  },
  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    const res = await api.put(`/problems/${id}`, data);
    return res.data;
  },
  async deleteProblem(id: string): Promise<boolean> {
    const res = await api.delete(`/problems/${id}`);
    return res.data.success;
  },
  async submitRating(id: string, rating: number, feedback: string): Promise<Problem> {
    const res = await api.post(`/problems/${id}/rating`, { rating, feedback });
    return res.data;
  }
};
