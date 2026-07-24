import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiPlus, FiActivity, FiCheckCircle, FiClock, FiThumbsUp, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  const fetchMyReports = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          ai_analysis (
            priority,
            startup_potential,
            solution
          ),
          votes (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching citizen reports:', err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const stats = [
    { label: 'Total Reports', value: reports.length, icon: FiActivity, color: 'text-primary-400', bg: 'bg-primary-500/20' },
    { label: 'Verified', value: reports.filter(r => r.status === 'Verified').length, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, icon: FiClock, color: 'text-amber-400', bg: 'bg-amber-500/20' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Hello, {user?.user_metadata?.name || 'Citizen'}</h1>
          <p className="text-dark-300">Track your community reports and AI insights.</p>
        </div>
        <Link to="/report/new" className="btn-primary flex items-center">
          <FiPlus className="mr-2" /> Report Problem
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex items-center">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-dark-300 text-sm font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-display font-bold text-white mb-6">Your Recent Reports</h2>
      
      {reports.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-dark-700 rounded-full flex items-center justify-center mb-4">
            <FiActivity className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No reports yet</h3>
          <p className="text-dark-300 mb-6">Start helping your community by reporting local issues.</p>
          <Link to="/report/new" className="btn-primary">Create First Report</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map(report => (
            <div key={report.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                    ${report.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 
                      report.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-primary-500/20 text-primary-400'}`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-dark-400">{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{report.title}</h3>
                <p className="text-dark-300 text-sm mb-4 line-clamp-2">{report.description}</p>
                
                {report.ai_analysis && report.ai_analysis[0] && (
                  <div className="bg-dark-700/50 p-4 rounded-lg border border-dark-600 mb-4">
                    <div className="flex items-center mb-2">
                      <FiCpu className="text-accent-violet mr-2" />
                      <span className="text-sm font-bold text-white">AI Suggestion</span>
                    </div>
                    <p className="text-xs text-dark-200">
                      {report.ai_analysis[0].solution || report.ai_analysis[0].startup_potential}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mt-2 border-t border-dark-600 pt-4">
                <div className="flex items-center text-dark-300">
                  <FiThumbsUp className="mr-1" /> {report.votes?.[0]?.count || 0} community votes
                </div>
                <button className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
