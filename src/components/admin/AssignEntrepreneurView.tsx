import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Star, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { User } from '../../types';

export const AssignEntrepreneurView: React.FC = () => {
  const { entrepreneurs, problems, assignEntrepreneur } = useApp();

  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<User | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');

  const unassignedProblems = problems.filter((p) => p.status === 'Pending');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntrepreneur || !selectedProblemId) return;
    assignEntrepreneur(selectedProblemId, selectedEntrepreneur.id);
    setSelectedEntrepreneur(null);
    setSelectedProblemId('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Verified Municipal Contractors & Entrepreneurs
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Dispatch unassigned community problem reports based on contractor skill set, location, and rating.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entrepreneurs.map((ent) => {
            const activeJobsCount = problems.filter(
              (p) =>
                p.assignedEntrepreneurId === ent.id &&
                (p.status === 'Accepted' || p.status === 'In Progress')
            ).length;

            return (
              <div
                key={ent.id}
                className="bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={ent.avatar}
                      alt={ent.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-200 dark:border-purple-800"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {ent.name}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{ent.rating || 4.9} / 5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ent.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-500 bg-white dark:bg-slate-800 p-3 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Base Sector:
                      </span>
                      <span>{ent.address?.split(',')[1] || 'Metro Central'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Active Contracts:
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {activeJobsCount} Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Total Solved:
                      </span>
                      <span className="font-bold text-emerald-600">
                        {ent.completedJobs || 24} Jobs
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedEntrepreneur(ent);
                    setSelectedProblemId(unassignedProblems[0]?.id || '');
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Problem Contract</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign Dialog */}
      {selectedEntrepreneur && (
        <Modal
          isOpen={!!selectedEntrepreneur}
          onClose={() => setSelectedEntrepreneur(null)}
          title={`Assign Contract to ${selectedEntrepreneur.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleAssign} className="space-y-4">
            {unassignedProblems.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                All reported citizen problems are currently assigned or solved!
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Select Unassigned Problem Report
                  </label>
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  >
                    {unassignedProblems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.title} ({p.category} • {p.priority} Priority)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Contractor Assignment
                </button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
