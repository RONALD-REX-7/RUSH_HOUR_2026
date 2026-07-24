import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/Badge';
import { Problem } from '../../types';
import {
  MessageSquare,
  Play,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Upload,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';

interface AcceptedProblemsListProps {
  viewMode?: 'accepted_problems' | 'my_work';
}

export const AcceptedProblemsList: React.FC<AcceptedProblemsListProps> = ({ viewMode = 'accepted_problems' }) => {
  const {
    problems,
    currentUser,
    updateProblemStatus,
    setActiveTab,
    setSelectedProblemForChat,
  } = useApp();

  const [solveModalProblem, setSolveModalProblem] = useState<Problem | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // Strict view mode filter
  const myFiltered = problems.filter((p) => {
    if (p.assignedEntrepreneurId !== currentUser?.id) return false;
    if (viewMode === 'accepted_problems') {
      return p.status === 'Accepted';
    }
    if (viewMode === 'my_work') {
      return p.status === 'In Progress';
    }
    return p.status === 'Accepted' || p.status === 'In Progress';
  });

  const handleConfirmSolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solveModalProblem) return;
    updateProblemStatus(solveModalProblem.id, 'Solved');
    setSolveModalProblem(null);
    setCompletionNotes('');
  };

  return (
    <div className="space-y-6">
      {myFiltered.length === 0 ? (
        <EmptyState
          title={viewMode === 'my_work' ? 'No Active Work In Progress' : 'No Accepted Problems'}
          description={
            viewMode === 'my_work'
              ? 'You do not have any problems currently in the solving process.'
              : 'You do not have any accepted problems awaiting work start.'
          }
          actionLabel="Browse Available Problems"
          onAction={() => setActiveTab('available_problems')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myFiltered.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    {p.id}
                  </span>
                  <StatusBadge status={p.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                  {p.description}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Citizen Name:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{p.citizenName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Location:
                    </span>
                    <span>{p.location}</span>
                  </div>
                  {p.acceptedDate && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Accepted Date:
                      </span>
                      <span>{new Date(p.acceptedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {p.category}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProblemForChat(p);
                      setActiveTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Chat
                  </button>

                  {p.status === 'Accepted' && (
                    <button
                      onClick={() => updateProblemStatus(p.id, 'In Progress')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center"
                    >
                      <Play className="w-3.5 h-3.5 mr-1" />
                      Start Solving (In Progress)
                    </button>
                  )}

                  {p.status === 'In Progress' && (
                    <button
                      onClick={() => setSolveModalProblem(p)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Mark Solved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Modal */}
      {solveModalProblem && (
        <Modal
          isOpen={!!solveModalProblem}
          onClose={() => setSolveModalProblem(null)}
          title={`Mark Job Solved - ${solveModalProblem.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmSolved} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Confirm site repairs are complete for <strong>"{solveModalProblem.title}"</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1">Completion Notes</label>
              <textarea
                rows={3}
                required
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Describe repairs made, materials used, and safety verification..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="p-4 border-2 border-dashed rounded-xl text-center bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
              <Upload className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>Attach After-Repair Site Photos (Optional)</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-md"
            >
              Verify & Complete Work Order
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
