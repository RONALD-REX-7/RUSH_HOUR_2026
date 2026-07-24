import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-dark-800/80 backdrop-blur-xl border-b border-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-display font-bold text-gradient">
              ProblemChain
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="text-dark-200 hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
                {user.role === 'citizen' && (
                  <Link to="/report/new" className="text-dark-200 hover:text-primary-400 transition-colors">
                    Report Problem
                  </Link>
                )}
                {(user.role === 'entrepreneur' || user.role === 'citizen') && (
                  <Link to="/opportunities" className="text-dark-200 hover:text-primary-400 transition-colors">
                    Opportunities
                  </Link>
                )}
                
                <Link to="/notifications" className="relative p-2 text-dark-200 hover:text-primary-400 transition-colors">
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-rose rounded-full"></span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0)}
                    </div>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-dark-700 rounded-xl shadow-xl border border-dark-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-dark-100 hover:bg-dark-600 hover:text-white">
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-accent-rose hover:bg-dark-600">
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark-200 hover:text-white transition-colors">Log in</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
