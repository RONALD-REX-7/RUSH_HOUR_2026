import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as opportunityService from '../services/opportunityService';
import * as queueService from '../services/queueService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiMapPin, FiActivity, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi';

const OpportunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    opportunityService.getOpportunity(id)
      .then(res => setOpp(res.data.data))
      .catch(err => {
        toast.error('Failed to load opportunity');
        navigate('/opportunities');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleJoinQueue = async () => {
    setJoining(true);
    try {
      await queueService.joinQueue(id, {});
      toast.success('Successfully joined the queue!');
      navigate('/entrepreneur/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join queue');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!opp) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="glass-card overflow-hidden">
        <div className="h-64 bg-gradient-to-r from-primary-900/50 to-dark-800 p-8 flex flex-col justify-end">
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-bold border border-primary-500/30">
              {opp.category}
            </span>
            <span className={`ml-3 px-3 py-1 rounded-full text-sm font-bold border ${opp.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
              {opp.status.toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{opp.title}</h1>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">Description</h2>
              <p className="text-dark-200 leading-relaxed whitespace-pre-wrap">{opp.description}</p>
            </section>
            
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">Community Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-700/50 p-4 rounded-xl border border-dark-600">
                  <div className="text-dark-300 text-sm mb-1 flex items-center"><FiActivity className="mr-2" /> Demand Score</div>
                  <div className="text-2xl font-bold text-white">{opp.demandScore}</div>
                </div>
                <div className="bg-dark-700/50 p-4 rounded-xl border border-dark-600">
                  <div className="text-dark-300 text-sm mb-1 flex items-center"><FiUsers className="mr-2" /> Citizens Affected</div>
                  <div className="text-2xl font-bold text-white">{opp.demandScore * 10}+</div>
                </div>
              </div>
            </section>
          </div>

          <div>
            <div className="bg-dark-700/50 p-6 rounded-xl border border-dark-600 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Opportunity Action</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-dark-200">
                  <FiMapPin className="mr-3 text-primary-400" /> Location attached
                </div>
                <div className="flex items-center text-sm text-dark-200">
                  <FiClock className="mr-3 text-primary-400" /> Created {new Date(opp.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {user?.role === 'entrepreneur' && opp.status === 'open' ? (
                <button 
                  onClick={handleJoinQueue}
                  disabled={joining}
                  className="w-full btn-primary flex justify-center items-center py-3"
                >
                  {joining ? 'Joining...' : <>Join Queue <FiArrowRight className="ml-2" /></>}
                </button>
              ) : user?.role === 'citizen' ? (
                <div className="text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                  Entrepreneurs can claim this opportunity. Share it to increase visibility!
                </div>
              ) : opp.status !== 'open' ? (
                <div className="text-sm text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 text-center font-medium">
                  Currently Being Solved
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
