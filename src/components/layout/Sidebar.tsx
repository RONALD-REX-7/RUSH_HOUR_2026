import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Briefcase,
  DollarSign,
  Users,
  UserCheck,
  BarChart3,
  Eye,
  Settings,
  FolderOpen,
  MapPin,
} from 'lucide-react';
import { Role } from '../../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentRole, activeTab, setActiveTab, logout, unreadNotificationCount } = useApp();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }

  const citizenNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report_problem', label: 'Report New Problem', icon: PlusCircle },
    { id: 'my_problems', label: 'My Problems', icon: AlertCircle },
    { id: 'accepted_problems', label: 'Accepted Problems', icon: Clock },
    { id: 'solved_problems', label: 'Solved Problems', icon: CheckCircle2 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const entrepreneurNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'available_problems', label: 'Available Problems', icon: FolderOpen },
    { id: 'accepted_problems', label: 'Accepted Problems', icon: Clock },
    { id: 'my_work', label: 'My Work', icon: Briefcase },
    { id: 'solved_problems', label: 'Solved Problems', icon: CheckCircle2 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'citizen_problems', label: 'Citizen Problems', icon: AlertCircle },
    { id: 'entrepreneurs', label: 'Entrepreneurs', icon: Users },
    { id: 'assign_problems', label: 'Assign Problems', icon: UserCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'chat_monitoring', label: 'Chat Monitoring', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = {
    citizen: citizenNav,
    entrepreneur: entrepreneurNav,
    admin: adminNav,
  }[currentRole];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 w-64">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {currentRole} Navigation
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
