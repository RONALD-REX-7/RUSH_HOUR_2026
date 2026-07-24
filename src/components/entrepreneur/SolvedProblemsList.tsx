import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Star, Calendar, MapPin, Quote } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export const SolvedProblemsList: React.FC = () => {
  const { problems, currentUser } = useApp();

  const mySolved = (problems || []).filter(
    (p) => p.assignedEntrepreneurId === currentUser?.id && p.status === 'Solved'
  );

  return (
    <div className="space-y-6">
      {mySolved.length === 0 ? (
        <EmptyState
          title="No Solved Problems Yet"
          description="When you mark accepted problems as solved, they will appear here with citizen ratings and feedback."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mySolved.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {p.id}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Solved
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {p.title}
                </h3>

                <div className="space-y-1 text-[11px] text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed On:</span>
                    <span>
                      {p.solvedDate ? new Date(p.solvedDate).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Citizen:</span>
                    <span className="font-semibold">{p.citizenName}</span>
                  </div>
                </div>

                {/* Citizen Rating & Feedback */}
                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                      Citizen Feedback & Rating
                    </span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            p.citizenRating && star <= p.citizenRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic flex items-start mt-1">
                    <Quote className="w-3 h-3 text-amber-400 mr-1 shrink-0 rotate-180" />
                    <span>
                      {p.citizenFeedback ||
                        'Citizen confirmed satisfactory completion of all site repairs.'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
