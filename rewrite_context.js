const fs = require('fs');

const content = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Problem, ProblemStatus, ChatMessage, NotificationItem } from '../types';
import { mockEntrepreneurPerformances } from '../data/mockData';
import { authApi } from '../services/authApi';
import { citizenApi } from '../services/citizenApi';
import { entrepreneurApi } from '../services/entrepreneurApi';
import { adminApi } from '../services/adminApi';
import { chatApi } from '../services/chatApi';
import { notificationApi } from '../services/notificationApi';

interface AppContextType {
  currentUser: User | null;
  currentRole: Role | null;
  problems: Problem[];
  chats: ChatMessage[];
  notifications: NotificationItem[];
  entrepreneurs: User[];
  entrepreneurPerformances: any[];
  themeMode: 'light' | 'dark';
  activeTab: string;
  selectedProblemForChat: string | null;
  unreadNotificationCount: number;
  
  goBack: () => void;
  login: (role: Role, email?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => void;
  
  reportProblem: (data: Partial<Problem>) => Promise<Problem>;
  editProblem: (problemId: string, updatedData: Partial<Problem>) => Promise<void>;
  deleteProblem: (problemId: string) => Promise<void>;
  
  acceptProblem: (problemId: string) => Promise<void>;
  assignEntrepreneur: (problemId: string, entrepreneurId: string) => Promise<void>;
  updateProblemStatus: (problemId: string, status: ProblemStatus) => Promise<void>;
  submitCitizenRating: (problemId: string, rating: number, feedback: string) => Promise<void>;
  
  sendChatMessage: (problemId: string, content: string, imageUrl?: string, fileUrl?: string, fileName?: string) => Promise<void>;
  
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  updateUserProfile: (updatedData: Partial<User>) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedProblemForChat: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [selectedProblemForChat, setSelectedProblemForChat] = useState<string | null>(null);
  const [entrepreneurs, setEntrepreneurs] = useState<User[]>([]);

  const fetchAllData = async () => {
    try {
      const apiProblems = await citizenApi.fetchProblems();
      setProblems(apiProblems);
      const apiChats = await chatApi.fetchChats();
      setChats(apiChats);
      const apiNotifs = await notificationApi.fetchNotifications();
      setNotifications(apiNotifs);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const savedToken = localStorage.getItem('pc_jwt_token');
    const savedUser = localStorage.getItem('pc_user');
    if (savedToken && savedUser) {
      const u = JSON.parse(savedUser) as User;
      setCurrentUser(u);
      setCurrentRole(u.role);
      fetchAllData();
    }
  }, []);

  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  
  const handleSetActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (tab !== 'messages') setSelectedProblemForChat(null);
  };

  const goBack = () => {
    setSelectedProblemForChat(null);
    setActiveTabState('dashboard');
  };

  const login = async (role: Role, email?: string) => {
    try {
      const { user } = await authApi.login(role, email);
      setCurrentUser(user);
      setCurrentRole(role);
      localStorage.setItem('pc_user', JSON.stringify(user));
      await fetchAllData();
      setActiveTabState('dashboard');
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem('pc_jwt_token');
    localStorage.removeItem('pc_user');
    setProblems([]);
    setChats([]);
    setNotifications([]);
  };

  const switchRole = async (role: Role) => {
    await login(role);
  };

  const reportProblem = async (data: Partial<Problem>) => {
    const res = await citizenApi.createProblem({
      ...data,
      citizenId: currentUser?.id,
      citizenName: currentUser?.name,
      citizenAvatar: currentUser?.avatar
    });
    await fetchAllData();
    return res;
  };

  const editProblem = async (problemId: string, updatedData: Partial<Problem>) => {
    await citizenApi.updateProblem(problemId, updatedData);
    await fetchAllData();
  };

  const deleteProblem = async (problemId: string) => {
    await citizenApi.deleteProblem(problemId);
    await fetchAllData();
  };

  const acceptProblem = async (problemId: string) => {
    if (!currentUser || currentUser.role !== 'entrepreneur') return;
    await entrepreneurApi.acceptProblem(problemId, currentUser.id);
    await fetchAllData();
  };

  const assignEntrepreneur = async (problemId: string, entrepreneurId: string) => {
    await adminApi.assignEntrepreneur(problemId, entrepreneurId);
    await fetchAllData();
  };

  const updateProblemStatus = async (problemId: string, status: ProblemStatus) => {
    if (status === 'In Progress') {
      await fetch('/api/entrepreneur/problems/'+problemId+'/progress', { method: 'PUT', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('pc_jwt_token') } });
    } else if (status === 'Solved') {
      await fetch('/api/entrepreneur/problems/'+problemId+'/complete', { method: 'PUT', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('pc_jwt_token') } });
    } else {
      await citizenApi.updateProblem(problemId, { status });
    }
    await fetchAllData();
  };

  const submitCitizenRating = async (problemId: string, rating: number, feedback: string) => {
    await citizenApi.submitRating(problemId, rating, feedback);
    await fetchAllData();
  };

  const sendChatMessage = async (problemId: string, content: string, imageUrl?: string, fileUrl?: string, fileName?: string) => {
    if (!currentUser) return;
    await chatApi.sendChatMessage({
      problemId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      imageUrl,
      fileUrl,
      fileName
    });
    await fetchAllData();
  };

  const markNotificationAsRead = async (id: string) => {
    await notificationApi.markRead(id);
    await fetchAllData();
  };

  const markAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    await notificationApi.markAllRead(currentUser.id);
    await fetchAllData();
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const newObj = { ...currentUser, ...updatedData };
    setCurrentUser(newObj);
    localStorage.setItem('pc_user', JSON.stringify(newObj));
  };

  const unreadNotificationCount = notifications.filter((n) => currentUser && n.userId === currentUser.id && !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, currentRole, problems, chats, notifications, entrepreneurs,
      entrepreneurPerformances: mockEntrepreneurPerformances, themeMode, activeTab,
      selectedProblemForChat, unreadNotificationCount, goBack, login, logout, switchRole,
      reportProblem, editProblem, deleteProblem, acceptProblem, assignEntrepreneur,
      updateProblemStatus, submitCitizenRating, sendChatMessage, markNotificationAsRead,
      markAllNotificationsAsRead, updateUserProfile, toggleTheme, setActiveTab: handleSetActiveTab,
      setSelectedProblemForChat
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
`;

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('done writing context');
