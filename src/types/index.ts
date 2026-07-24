export type Role = 'citizen' | 'entrepreneur' | 'admin';

export type Priority = 'Low' | 'Medium' | 'High';

export type ProblemStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Solved';

export type Category = 
  | 'Roads'
  | 'Water Supply'
  | 'Electricity'
  | 'Garbage Collection'
  | 'Street Lights'
  | 'Public Transport'
  | 'Stores'
  | 'Shopping Issues'
  | 'Daily Life Issues'
  | 'Healthcare'
  | 'Education'
  | 'Others';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  address: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  completedJobs?: number;
  monthlyEarnings?: number;
}

export interface Problem {
  id: string; // e.g., 'PRB-101'
  title: string;
  category: Category;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number }; // For visual map
  images: string[];
  priority: Priority;
  status: ProblemStatus;
  dateSubmitted: string; // ISO or formatted date
  citizenId: string;
  citizenName: string;
  citizenAvatar: string;
  assignedEntrepreneurId?: string;
  assignedEntrepreneurName?: string;
  assignedEntrepreneurAvatar?: string;
  acceptedDate?: string;
  solvedDate?: string;
  citizenRating?: number; // 1-5
  citizenFeedback?: string;
}

export interface ChatMessage {
  id: string;
  problemId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar: string;
  content: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'problem_submitted' | 'problem_accepted' | 'problem_assigned' | 'problem_solved' | 'new_message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkId?: string; // problemId or chatId
}

export interface EntrepreneurPerformance {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  completedJobs: number;
  monthlyEarnings: number;
  totalRevenue: number;
  performanceScore: number;
  location: string;
}

export interface MonthlyReportData {
  month: string;
  reports: number;
  solved: number;
}

export interface DailyResolutionData {
  day: string;
  resolved: number;
  inProgress: number;
}

export interface CategoryData {
  category: string;
  count: number;
  color: string;
}
