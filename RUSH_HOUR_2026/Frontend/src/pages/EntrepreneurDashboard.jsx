import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiTrendingUp, FiTarget, FiZap, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const EntrepreneurDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          ai_analysis (
            priority,
            severity_score,
            startup_potential,
            solution
          )
        `)
        .eq('status', 'Verified')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const analyzedData = data.filter(d => d.ai_analysis && d.ai_analysis.length > 0);
      setOpportunities(analyzedData);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const scores = { 'High (8-10)': 0, 'Medium (4-7)': 0, 'Low (1-3)': 0 };
    opportunities.forEach(opp => {
      const score = opp.ai_analysis[0]?.severity_score || 0;
      if (score >= 8) scores['High (8-10)']++;
      else if (score >= 4) scores['Medium (4-7)']++;
      else scores['Low (1-3)']++;
    });

    return {
      labels: Object.keys(scores),
      datasets: [
        {
          label: 'Severity Distribution',
          data: Object.values(scores),
          backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'],
          borderRadius: 4,
        }
      ]
    };
  }, [opportunities]);

  if (loading) return <LoadingSpinner fullPage />;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome, {user?.user_metadata?.name || 'Founder'}</h1>
          <p className="text-dark-300">Discover AI-analyzed problems to build your next startup around.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/map" className="glass px-4 py-2 rounded-lg flex items-center hover:bg-dark-700 transition-colors text-white text-sm font-medium">
            <FiMapPin className="mr-2" /> View Map
          </Link>
        </div>
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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-white flex items-center">
          <FiTrendingUp className="mr-2 text-accent-violet" /> High-Impact Opportunities
        </h2>
      </div>
      
      {highImpact.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-dark-300">No high-priority verified problems at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {highImpact.map(opp => (
            <div key={opp.id} className="glass-card p-6 border-t-4 border-red-500 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-dark-700 text-dark-200 text-xs px-2 py-1 rounded font-medium">
                    {opp.category}
                  </span>
                  <span className="text-xs font-bold text-red-400 flex items-center">
                    <FiAlertTriangle className="mr-1" /> IMPACT: {opp.ai_analysis[0].severity_score}/10
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{opp.title}</h3>
                
                <div className="mt-4 p-3 bg-dark-700/50 rounded border border-dark-600">
                  <span className="text-xs font-bold text-accent-violet uppercase tracking-wider block mb-1">Market Idea</span>
                  <p className="text-sm text-dark-200">{opp.ai_analysis[0].startup_potential}</p>
                </div>
              </div>
              <button className="w-full mt-4 btn-primary py-2 text-sm">
                Analyze Solution
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-display font-bold text-white mb-6">Trending Market Ideas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.filter(o => o.ai_analysis?.[0]?.priority !== 'High').slice(0, 4).map(opp => (
          <div key={opp.id} className="glass-card p-6 flex flex-col sm:flex-row gap-4">
             {opp.image_url && (
               <div className="w-full sm:w-1/3 h-32 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0">
                 <img src={opp.image_url} alt="Problem" className="w-full h-full object-cover" />
               </div>
             )}
             <div className="flex-1">
               <h3 className="text-md font-bold text-white mb-1 line-clamp-1">{opp.title}</h3>
               <p className="text-xs text-dark-400 mb-3">{opp.category} • {opp.votes?.[0]?.count || 0} Votes</p>
               <div className="bg-dark-700/30 p-2 rounded border border-dark-600">
                 <p className="text-xs text-dark-200 line-clamp-2">
                   <span className="text-primary-400 font-semibold">AI Suggestion:</span> {opp.ai_analysis?.[0]?.solution || 'Analyzing...'}
                 </p>
               </div>
               <button className="text-primary-400 text-xs font-medium mt-3 hover:text-primary-300">View Full Analysis &rarr;</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
