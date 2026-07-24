import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as milestoneService from '../services/milestoneService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProjectTracking = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    milestoneService.getMilestones(id)
      .then(res => setMilestones(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-2">Project Tracking</h1>
      <p className="text-dark-300 mb-8">Monitor the milestones and progress of this solution.</p>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-600 before:to-transparent">
        {milestones.length === 0 ? (
          <div className="text-center text-dark-300 py-10 relative z-10 bg-dark-900">
            No milestones have been added for this project yet.
          </div>
        ) : (
          milestones.map((m, idx) => (
            <div key={m._id} className="relative z-10 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow ${m.status === 'completed' ? 'bg-emerald-500' : 'bg-primary-500'}`}>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 glass-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-lg">{m.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-dark-200">{m.description}</p>
                {m.completedAt && (
                  <div className="text-xs text-dark-400 mt-4">Completed: {new Date(m.completedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectTracking;
