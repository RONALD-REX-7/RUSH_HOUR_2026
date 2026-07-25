import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};
