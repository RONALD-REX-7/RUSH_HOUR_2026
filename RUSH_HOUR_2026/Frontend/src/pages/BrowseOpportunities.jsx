import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as opportunityService from '../services/opportunityService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiFilter, FiMapPin, FiUsers } from 'react-icons/fi';

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    opportunityService.getOpportunities()
      .then(res => setOpportunities(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Opportunities</h1>
          <p className="text-dark-300">Browse verified problems ready for a solution.</p>
        </div>
        <div className="flex bg-dark-700 p-1 rounded-lg">
          {['All', 'High Demand', 'New'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-300 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div key={opp._id} className="glass-card overflow-hidden flex flex-col group">
            <div className="h-48 bg-dark-700 relative">
              {/* Placeholder for map/image */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent z-10"></div>
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-dark-900/80 backdrop-blur rounded-full text-xs font-bold text-primary-400 border border-primary-500/20">
                  {opp.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{opp.title}</h3>
              <p className="text-dark-300 text-sm mb-4 line-clamp-3 flex-1">{opp.description}</p>
              
              <div className="flex items-center justify-between text-sm text-dark-300 mb-6 pb-4 border-b border-dark-700">
                <div className="flex items-center"><FiMapPin className="mr-1" /> Location</div>
                <div className="flex items-center"><FiUsers className="mr-1" /> {opp.demandScore} Score</div>
              </div>
              
              <Link to={`/opportunities/${opp._id}`} className="btn-primary w-full text-center">
                View Details
              </Link>
            </div>
          </div>
        ))}
        {opportunities.length === 0 && (
          <div className="col-span-3 text-center py-20 glass-card">
            <h3 className="text-xl font-medium text-white mb-2">No opportunities found</h3>
            <p className="text-dark-300">Check back later or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseOpportunities;
