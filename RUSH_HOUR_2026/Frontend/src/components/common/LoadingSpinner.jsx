import React from 'react';

const LoadingSpinner = ({ fullPage }) => {
  const spinner = (
    <div className="relative w-12 h-12 flex justify-center items-center">
      <div className="absolute w-full h-full border-4 border-dark-600 rounded-full"></div>
      <div className="absolute w-full h-full border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex justify-center items-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
