import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { User } from '../../types';

export const AssignEntrepreneurView: React.FC = () => {
  const { entrepreneurs, problems, assignEntrepreneur } = useApp();

  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<User | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');

  const safeEntrepreneurs = entrepreneurs || [];
  const safeProblems = problems || [];

  const unassignedProblems = safeProblems.filter((p) => p.status === 'Pending');

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
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2.5" />
              Entrepreneurs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              List of entrepreneurs with solved/in-process problems and quick problem assignment
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200/50 w-fit">
            {safeEntrepreneurs.length} Registered Entrepreneurs
          </span>
        </div>

        {/* Row List View of Entrepreneurs with Solved & In-Process Problems */}
        <div className="space-y-3">
          {safeEntrepreneurs.map((ent) => {
            const solvedList = safeProblems.filter(
              (p) => p.assignedEntrepreneurId === ent.id && p.status === 'Solved'
            );
            const inProgressList = safeProblems.filter(
              (p) =>
                p.assignedEntrepreneurId === ent.id &&
                (p.status === 'In Progress' || p.status === 'Accepted')
            );

            return (
              <div
                key={ent.id}
                className="p-4 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-2xs"
              >
                {/* Entrepreneur Name & Avatar */}
                <div className="flex items-center space-x-3.5 shrink-0 min-w-[200px]">
                  <img
                    src={ent.avatar}
                    alt={ent.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                      Entrepreneur
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {ent.name}
                    </h4>
                  </div>
                </div>

                {/* Problems (Solved & In-Process) in the same row */}
                <div className="flex flex-wrap items-center gap-2 text-xs flex-1 min-w-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
                  {/* Solved Summary Badge */}
                  <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {solvedList.length || ent.completedJobs || 0} Solved
                  </span>

                  {/* In Process Summary Badge */}
                  <span className="inline-flex items-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-200/60 shrink-0">
                    <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
                    {inProgressList.length} In Process
                  </span>

                  {/* Individual Solved Problem Badges */}
                  {solvedList.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      title={p.title}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                      <span className="font-mono font-bold mr-1">{p.id}:</span>
                      <span className="truncate max-w-[130px]">{p.title}</span>
                    </span>
                  ))}

                  {/* Individual In-Process Problem Badges */}
                  {inProgressList.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      title={p.title}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
                      <span className="font-mono font-bold mr-1">{p.id}:</span>
                      <span className="truncate max-w-[130px]">{p.title}</span>
                    </span>
                  ))}

                  {solvedList.length === 0 && inProgressList.length === 0 && (
                    <span className="text-xs text-slate-400 italic">
                      No problems assigned
                    </span>
                  )}
                </div>

                {/* Assign Problem Action */}
                <button
                  onClick={() => {
                    setSelectedEntrepreneur(ent);
                    setSelectedProblemId(unassignedProblems[0]?.id || '');
                  }}
                  className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Problem</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign Problem Modal */}
      {selectedEntrepreneur && (
        <Modal
          isOpen={!!selectedEntrepreneur}
          onClose={() => setSelectedEntrepreneur(null)}
          title={`Assign Problem to ${selectedEntrepreneur.name}`}
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
                  <label className="block text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Select Unassigned Problem Report
                  </label>
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
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
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Confirm Assignment
                </button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};



