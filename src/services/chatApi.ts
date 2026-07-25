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
