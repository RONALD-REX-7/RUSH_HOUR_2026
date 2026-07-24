import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 animate-fade-in text-center">
      <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-8">
        <FiAlertTriangle className="w-12 h-12 text-accent-amber" />
      </div>
      <h1 className="text-6xl font-display font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-medium text-dark-100 mb-6">Page not found</h2>
      <p className="text-dark-300 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
