import React from 'react';
import { Priority, ProblemStatus } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    High: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${styles[priority]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
      {priority}
    </span>
  );
};

interface StatusBadgeProps {
  status: ProblemStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    Pending: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    Accepted: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
    Solved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${styles[status]}`}
    >
      {status}
    </span>
  );
};
