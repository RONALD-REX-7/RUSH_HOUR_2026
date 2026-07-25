import api from './api';
import { Problem } from '../types';

export const entrepreneurApi = {
  async acceptProblem(id: string, entrepreneurId: string): Promise<Problem> {
    const res = await api.post(`/problems/${id}/assign`, { entrepreneurId });
    return res.data;
  }
};
