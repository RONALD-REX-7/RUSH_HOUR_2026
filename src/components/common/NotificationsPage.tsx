import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Filter, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('All');

  const myNotifs = notifications.filter((n) => currentUser && n.userId === currentUser.id);

  const filtered = myNotifs.filter((n) => {
    if (filterType === 'All') return true;
    if (filterType === 'Unread') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Notification Center
          </h2>
          <p className="text-xs text-slate-500">
            Real-time activity alerts for problem reports, chat messages, and contractor updates
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-semibold">
        {['All', 'Unread', 'problem_accepted', 'new_message', 'problem_assigned', 'problem_solved'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {type === 'problem_accepted'
                ? 'Accepted'
                : type === 'new_message'
                ? 'Chat Msgs'
                : type === 'problem_assigned'
                ? 'Assigned'
                : type === 'problem_solved'
                ? 'Solved'
                : type}
            </button>
          )
        )}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You are all caught up! No notifications match the selected filter."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.linkId) {
                  setActiveTab('chat');
                }
              }}
              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    n.type === 'problem_solved'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : n.type === 'new_message'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {n.message}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(n.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
