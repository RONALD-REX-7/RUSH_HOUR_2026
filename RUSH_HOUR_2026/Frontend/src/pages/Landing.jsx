import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiMapPin, FiTarget, FiUsers, FiArrowRight, FiShield } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow mr-2"></span>
            <span className="text-sm font-medium text-dark-100">Live across 50+ cities</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Transform Community Problems <br className="hidden md:block"/>
            Into <span className="text-gradient">Startup Opportunities</span>
          </h1>
          <p className="text-xl text-dark-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Citizens report local issues. AI validates them. Entrepreneurs solve them. 
            Join the ecosystem building better cities and profitable ventures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center">
              Start Building <FiArrowRight className="ml-2" />
            </Link>
            <Link to="/map" className="glass px-8 py-4 rounded-lg font-medium hover:bg-dark-700 transition-colors w-full sm:w-auto flex items-center justify-center">
              <FiMapPin className="ml-2 mr-2" /> Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-dark-700/50 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <div className="text-4xl font-display font-bold text-white mb-2">10k+</div>
              <div className="text-dark-300">Problems Reported</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-white mb-2">500+</div>
              <div className="text-dark-300">Startups Launched</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-white mb-2">$2M+</div>
              <div className="text-dark-300">Economic Value</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-white mb-2">100%</div>
              <div className="text-dark-300">Verified Issues</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How ProblemChain Works</h2>
          <p className="text-dark-300 max-w-2xl mx-auto">A seamless pipeline from local frustration to scalable innovation.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-6">
              <FiTarget className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. Report</h3>
            <p className="text-dark-200">Citizens drop a pin on the map and describe the local issue they're facing.</p>
          </div>
          
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="w-14 h-14 rounded-xl bg-accent-violet/20 flex items-center justify-center text-accent-violet mb-6">
              <FiShield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. Verify</h3>
            <p className="text-dark-200">AI and community upvotes validate the demand and urgency of the problem.</p>
          </div>
          
          <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <FiTrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Solve</h3>
            <p className="text-dark-200">Entrepreneurs claim verified problems, join the queue, and build startups.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-dark-900"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center glass-card p-12 animate-scale-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to make an impact?</h2>
          <p className="text-xl text-dark-200 mb-8">Join thousands of citizens and builders transforming cities today.</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-block">
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
