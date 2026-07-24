import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCheck, FiX, FiDatabase, FiPieChart, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select(`
          *,
          ai_analysis (priority)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching admin reports:', err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, currentStatus) => {
    if (currentStatus === 'Verified') return;
    
    try {
      const { error } = await supabase
        .from('problems')
        .update({ status: 'Verified' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Report Verified!');
      
      setReports(reports.map(r => r.id === id ? { ...r, status: 'Verified' } : r));
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error('Verification failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Report Deleted');
      
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Deletion failed');
    }
  };

  const categoryData = useMemo(() => {
    const counts = {};
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(14, 165, 233, 0.8)'
          ],
          borderColor: 'rgba(30, 41, 59, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [reports]);

  if (loading) return <LoadingSpinner fullPage />;

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const verifiedCount = reports.filter(r => r.status === 'Verified').length;
  const aiAnalyzedCount = reports.filter(r => r.ai_analysis?.length > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Command Center</h1>
        <p className="text-dark-300">Verify community reports and monitor platform analytics.</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-6 border-t-2 border-primary-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <span className="text-dark-300 text-sm font-medium">Total Reports</span>
              <FiDatabase className="text-primary-400" />
            </div>
            <span className="text-3xl font-bold text-white">{reports.length}</span>
          </div>
          <div className="glass-card p-6 border-t-2 border-amber-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <span className="text-dark-300 text-sm font-medium">Pending Verification</span>
              <FiPieChart className="text-amber-400" />
            </div>
            <span className="text-3xl font-bold text-white">{pendingCount}</span>
          </div>
          <div className="glass-card p-6 border-t-2 border-emerald-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <span className="text-dark-300 text-sm font-medium">Verified Issues</span>
              <FiCheck className="text-emerald-400" />
            </div>
            <span className="text-3xl font-bold text-white">{verifiedCount}</span>
          </div>
          <div className="glass-card p-6 border-t-2 border-accent-violet hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <span className="text-dark-300 text-sm font-medium">AI Analyzed</span>
              <FiUsers className="text-accent-violet" />
            </div>
            <span className="text-3xl font-bold text-white">{aiAnalyzedCount}</span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="glass-card p-6 flex flex-col items-center justify-center h-[280px]">
          <h3 className="text-sm font-medium text-dark-200 mb-4 self-start w-full">Category Distribution</h3>
          {reports.length > 0 ? (
            <div className="h-48 w-full max-w-[200px]">
              <Pie data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          ) : (
             <p className="text-dark-400 text-sm italic">No data to display.</p>
          )}
        </div>
      </div>

      <h2 className="text-xl font-display font-bold text-white mb-6">Report Management Queue</h2>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-dark-200">
            <thead className="bg-dark-700/50 text-dark-300 uppercase font-medium border-b border-dark-600">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">AI Priority</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                      ${report.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium mb-1 line-clamp-1">{report.title}</p>
                    <p className="text-xs text-dark-400">{report.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    {report.ai_analysis && report.ai_analysis.length > 0 ? (
                       <span className={`font-semibold ${
                         report.ai_analysis[0].priority === 'High' ? 'text-red-400' : 
                         report.ai_analysis[0].priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                       }`}>
                         {report.ai_analysis[0].priority}
                       </span>
                    ) : (
                      <span className="text-dark-400 italic">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {report.status !== 'Verified' && (
                      <button 
                        onClick={() => handleVerify(report.id, report.status)}
                        className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded transition-colors"
                        title="Verify Report"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      title="Delete Report"
                    >
                      <FiX />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-dark-400 italic">
                    No reports found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
