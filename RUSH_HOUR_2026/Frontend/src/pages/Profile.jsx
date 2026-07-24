import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Profile Details</h1>
      
      <div className="glass-card p-8">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-dark-700">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center text-4xl text-white font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-primary-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
            <div className="px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white">
              {user?.email}
            </div>
          </div>
          {user?.role === 'entrepreneur' && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Company Name</label>
              <div className="px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white">
                {user?.companyName || 'Not specified'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
