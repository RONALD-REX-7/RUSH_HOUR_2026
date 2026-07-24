import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-display font-bold text-gradient">ProblemChain</span>
            <p className="text-dark-300 mt-2 text-sm">Transforming local problems into startup opportunities.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-dark-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-dark-300 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-dark-300 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-800 text-center text-dark-400 text-sm">
          &copy; {new Date().getFullYear()} ProblemChain. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
