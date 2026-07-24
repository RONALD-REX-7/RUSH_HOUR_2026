import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiCpu, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in z-10">
        
        {/* Decorative Blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent-violet/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-dark-800/80 border border-dark-600 rounded-full px-4 py-1.5 mb-8 animate-float">
          <span className="flex h-2 w-2 rounded-full bg-primary-400 animate-pulse-glow"></span>
          <span className="text-sm font-medium text-dark-200">Powered by Gemini 2.5 AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 max-w-4xl">
          Turn Community Problems into <br className="hidden md:block"/>
          <span className="text-gradient">Startup Opportunities</span>
        </h1>
        
        <p className="text-lg md:text-xl text-dark-300 max-w-2xl mb-10 leading-relaxed">
          Citizens report local issues. Google Gemini analyzes the impact. Entrepreneurs build the solutions. Join the civic-tech revolution.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Link to="/report/new" className="btn-primary py-4 px-8 text-lg hover:-translate-y-1 transition-transform">
            Report a Problem
          </Link>
          <Link to="/map" className="glass bg-dark-700 hover:bg-dark-600 text-white border border-dark-500 px-8 py-4 rounded-lg font-medium transition-all hover:-translate-y-1 flex items-center justify-center text-lg">
            Explore Map <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Visual Timeline Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 bg-dark-900/50 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">How ProblemChain Works</h2>
            <p className="text-dark-300 max-w-2xl mx-auto">A seamless pipeline from civic frustration to entrepreneurial innovation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-dark-600 via-primary-500/50 to-dark-600 -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="glass-card p-8 text-center relative z-10 animate-fade-in delay-100">
              <div className="w-16 h-16 mx-auto bg-dark-700 border border-dark-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-dark-900/50">
                <FiMapPin className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Citizens Report</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Locals drop a pin on the map and describe infrastructure, environmental, or social issues in their area.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 text-center relative z-10 animate-fade-in delay-200">
              <div className="w-16 h-16 mx-auto bg-dark-700 border border-primary-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/10">
                <FiCpu className="w-8 h-8 text-accent-violet animate-pulse-glow" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. AI Analyzes</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Gemini AI instantly scores the severity, categorizes the issue, and generates actionable market ideas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 text-center relative z-10 animate-fade-in delay-300">
              <div className="w-16 h-16 mx-auto bg-dark-700 border border-dark-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-dark-900/50">
                <FiTrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Startups Build</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Entrepreneurs browse a dashboard of high-impact, community-validated problems ready for innovation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
