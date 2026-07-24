import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { FiBell, FiCheck } from 'react-icons/fi';

const Notifications = () => {
  const { notifications, markRead, markAllRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Notifications</h1>
          <p className="text-dark-300 mt-1">Stay updated on your reports and queues.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllRead} className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FiBell className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">You're all caught up!</h3>
            <p className="text-dark-300">No new notifications right now.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`glass-card p-4 flex gap-4 items-start ${!notif.isRead ? 'border-primary-500/30 bg-primary-500/5' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-700 text-dark-400'}`}>
                <FiBell />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm mb-1">{notif.message}</p>
                <span className="text-xs text-dark-400">{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              {!notif.isRead && (
                <button onClick={() => markRead(notif._id)} className="p-2 text-dark-400 hover:text-emerald-400 transition-colors" title="Mark as read">
                  <FiCheck />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
