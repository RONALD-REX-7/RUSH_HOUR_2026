import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Problem,
  ProblemStatus,
  ChatMessage,
  NotificationItem,
  EntrepreneurPerformance,
} from '../types';
import {
  mockUsers,
  mockProblems,
  mockChats,
  mockNotifications,
  mockEntrepreneurPerformances,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  currentRole: Role;
  problems: Problem[];
  chats: ChatMessage[];
  notifications: NotificationItem[];
  entrepreneurs: User[];
  entrepreneurPerformances: EntrepreneurPerformance[];
  themeMode: 'light' | 'dark';
  activeTab: string;
  selectedProblemForChat: Problem | null;
  unreadNotificationCount: number;
  
  // Handlers
  login: (role: Role, email?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  reportProblem: (data: Partial<Problem>) => Problem;
  editProblem: (problemId: string, updatedData: Partial<Problem>) => void;
  deleteProblem: (problemId: string) => void;
  acceptProblem: (problemId: string) => void;
  assignEntrepreneur: (problemId: string, entrepreneurId: string) => void;
  updateProblemStatus: (problemId: string, status: ProblemStatus, note?: string) => void;
  submitCitizenRating: (problemId: string, rating: number, feedback: string) => void;
  sendChatMessage: (problemId: string, content: string, imageUrl?: string, fileUrl?: string, fileName?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedProblemForChat: (problem: Problem | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state from localStorage or mockData
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pc_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockUsers[0]; // Default Sarah Jenkins (Citizen)
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (currentUser?.role as Role) || 'citizen';
  });

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('pc_problems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
    }
    return mockProblems;
  });

  const [chats, setChats] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pc_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
    }
    return mockChats;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pc_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { /* ignore */ }
    }
    return mockNotifications;
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('pc_theme') as 'light' | 'dark') || 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProblemForChat, setSelectedProblemForChat] = useState<Problem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pc_current_user', JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('pc_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pc_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('pc_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('pc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pc_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Login handler
  const login = (role: Role, email?: string) => {
    let matchedUser = mockUsers.find((u) => u.role === role);
    if (email) {
      const foundByEmail = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (foundByEmail) matchedUser = foundByEmail;
    }
    if (!matchedUser) {
      matchedUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    }
    setCurrentUser(matchedUser);
    setCurrentRole(role);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: Role) => {
    login(role);
  };

  // Report Problem
  const reportProblem = (data: Partial<Problem>): Problem => {
    const newId = `PRB-${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    const newProblem: Problem = {
      id: newId,
      title: data.title || 'Untitled Problem',
      category: data.category || 'Others',
      description: data.description || '',
      location: data.location || 'Metro Area',
      coordinates: data.coordinates || {
        lat: 37.77 + (Math.random() - 0.5) * 0.05,
        lng: -122.42 + (Math.random() - 0.5) * 0.05,
      },
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
      ],
      priority: data.priority || 'Medium',
      status: 'Pending',
      dateSubmitted: nowIso,
      citizenId: currentUser?.id || 'usr-citizen-1',
      citizenName: currentUser?.name || 'Sarah Jenkins',
      citizenAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };

    setProblems((prev) => [newProblem, ...prev]);

    // Push notification to Admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'usr-admin-1',
      type: 'problem_submitted',
      title: 'New Problem Reported',
      message: `${newProblem.citizenName} reported "${newProblem.title}" in ${newProblem.category}.`,
      timestamp: nowIso,
      read: false,
      linkId: newProblem.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newProblem;
  };

  // Edit Problem
  const editProblem = (problemId: string, updatedData: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            ...updatedData,
          };
        }
        return p;
      })
    );
  };

  // Delete Problem
  const deleteProblem = (problemId: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== problemId));
  };

  // Accept Problem by Entrepreneur
  const acceptProblem = (problemId: string) => {
    if (!currentUser || currentUser.role !== 'entrepreneur') return;
    const nowIso = new Date().toISOString();

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            status: 'Accepted',
            assignedEntrepreneurId: currentUser.id,
            assignedEntrepreneurName: currentUser.name,
            assignedEntrepreneurAvatar: currentUser.avatar,
            acceptedDate: nowIso,
          };
        }
        return p;
      })
    );

    // Notify Citizen
    const problemObj = problems.find((p) => p.id === problemId);
    if (problemObj) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: problemObj.citizenId,
        type: 'problem_accepted',
        title: 'Problem Accepted!',
        message: `${currentUser.name} has accepted your reported problem "${problemObj.title}".`,
        timestamp: nowIso,
        read: false,
        linkId: problemId,
      };
      setNotifications((prev) => [notif, ...prev]);

      // System greeting chat
      sendChatMessage(
        problemId,
        `Hello ${problemObj.citizenName}, I have accepted your problem assignment and am reviewing the site details.`,
      );
    }
  };

  // Assign Entrepreneur by Admin
  const assignEntrepreneur = (problemId: string, entrepreneurId: string) => {
    const entUser = mockUsers.find((u) => u.id === entrepreneurId);
    if (!entUser) return;
    const nowIso = new Date().toISOString();

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            status: 'Accepted',
            assignedEntrepreneurId: entUser.id,
            assignedEntrepreneurName: entUser.name,
            assignedEntrepreneurAvatar: entUser.avatar,
            acceptedDate: nowIso,
          };
        }
        return p;
      })
    );

    const problemObj = problems.find((p) => p.id === problemId);
    if (problemObj) {
      // Notify Entrepreneur
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}-ent`,
          userId: entUser.id,
          type: 'problem_assigned',
          title: 'Problem Assigned to You',
          message: `Admin assigned "${problemObj.title}" to your agency.`,
          timestamp: nowIso,
          read: false,
          linkId: problemId,
        },
        // Notify Citizen
        {
          id: `notif-${Date.now()}-cit`,
          userId: problemObj.citizenId,
          type: 'problem_assigned',
          title: 'Entrepreneur Assigned',
          message: `Admin assigned ${entUser.name} to work on your problem "${problemObj.title}".`,
          timestamp: nowIso,
          read: false,
          linkId: problemId,
        },
        ...prev,
      ]);
    }
  };

  // Update Status (In Progress or Solved)
  const updateProblemStatus = (problemId: string, status: ProblemStatus) => {
    const nowIso = new Date().toISOString();

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            status,
            ...(status === 'Solved' ? { solvedDate: nowIso } : {}),
          };
        }
        return p;
      })
    );

    const problemObj = problems.find((p) => p.id === problemId);
    if (problemObj) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: problemObj.citizenId,
        type: status === 'Solved' ? 'problem_solved' : 'system',
        title: `Problem ${status}`,
        message: `Your problem "${problemObj.title}" is now marked as ${status}.`,
        timestamp: nowIso,
        read: false,
        linkId: problemId,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Submit Rating & Feedback from Citizen
  const submitCitizenRating = (problemId: string, rating: number, feedback: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            citizenRating: rating,
            citizenFeedback: feedback,
          };
        }
        return p;
      })
    );
  };

  // Send Chat Message
  const sendChatMessage = (
    problemId: string,
    content: string,
    imageUrl?: string,
    fileUrl?: string,
    fileName?: string
  ) => {
    if (!currentUser) return;
    const nowIso = new Date().toISOString();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      problemId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      imageUrl,
      fileUrl,
      fileName,
      timestamp: nowIso,
      read: false,
    };

    setChats((prev) => [...prev, newMsg]);

    // Send notification to recipient
    const problemObj = problems.find((p) => p.id === problemId);
    if (problemObj) {
      const recipientId =
        currentUser.id === problemObj.citizenId
          ? problemObj.assignedEntrepreneurId
          : problemObj.citizenId;

      if (recipientId) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: recipientId,
            type: 'new_message',
            title: `New message from ${currentUser.name}`,
            message: content.slice(0, 60) + (content.length > 60 ? '...' : ''),
            timestamp: nowIso,
            read: false,
            linkId: problemId,
          },
          ...prev,
        ]);
      }
    }
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  // Profile update
  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const newObj = { ...currentUser, ...updatedData };
    setCurrentUser(newObj);
  };

  const unreadNotificationCount = (notifications || []).filter(
    (n) => currentUser && n.userId === currentUser.id && !n.read
  ).length;

  const entrepreneurs = (mockUsers || []).filter((u) => u.role === 'entrepreneur');

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        problems,
        chats,
        notifications,
        entrepreneurs,
        entrepreneurPerformances: mockEntrepreneurPerformances,
        themeMode,
        activeTab,
        selectedProblemForChat,
        unreadNotificationCount,

        login,
        logout,
        switchRole,
        reportProblem,
        editProblem,
        deleteProblem,
        acceptProblem,
        assignEntrepreneur,
        updateProblemStatus,
        submitCitizenRating,
        sendChatMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateUserProfile,
        toggleTheme,
        setActiveTab,
        setSelectedProblemForChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
