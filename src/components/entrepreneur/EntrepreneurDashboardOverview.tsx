import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import {
  FolderOpen,
  Clock,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  MessageSquare,
  DollarSign,
  MapPin,
  Building,
} from 'lucide-react';

export const EntrepreneurDashboardOverview: React.FC = () => {
  const { problems, currentUser, setActiveTab, setSelectedProblemForChat } = useApp();

  const availableProblems = problems.filter((p) => p.status === 'Pending');
  const myAccepted = problems.filter(
    (p) => p.assignedEntrepreneurId === currentUser?.id && p.status === 'Accepted'
  );
  const myInProgress = problems.filter(
    (p) => p.assignedEntrepreneurId === currentUser?.id && p.status === 'In Progress'
  );
  const mySolved = problems.filter(
    (p) => p.assignedEntrepreneurId === currentUser?.id && p.status === 'Solved'
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/20 tracking-wider uppercase">
            Entrepreneur & Contractor Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentUser?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Review civic maintenance contracts, accept assigned problem reports, update field progress, and earn revenue upon citizen verification.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('available_problems')}
          className="z-10 inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-lg transition-all transform hover:scale-105 shrink-0"
        >
          <FolderOpen className="w-4 h-4 text-emerald-600" />
          <span>Browse Available Jobs</span>
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Problems"
          value={availableProblems.length}
          icon={FolderOpen}
          color="blue"
          description="Open for acceptance"
        />
        <StatCard
          title="Accepted Problems"
          value={myAccepted.length}
          icon={Clock}
          color="amber"
          description="Ready for site work"
        />
        <StatCard
          title="Pending Work (In Progress)"
          value={myInProgress.length}
          icon={Briefcase}
          color="purple"
          description="Active repair crews"
        />
        <StatCard
          title="Solved Problems"
          value={mySolved.length}
          icon={CheckCircle2}
          color="green"
          description="Completed & verified"
        />
      </div>

      {/* Accepted & Active Jobs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Active Contracts & Work Orders
            </h3>
            <p className="text-xs text-slate-500">
              Problems accepted by your agency currently in repair or inspection stage
            </p>
          </div>

          <button
            onClick={() => setActiveTab('accepted_problems')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center"
          >
            <span>View All Work</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {myAccepted.length === 0 && myInProgress.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No active jobs right now. Browse "Available Problems" to claim a municipal project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...myAccepted, ...myInProgress].map((p) => (
              <div
                key={p.id}
                className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {p.id}
                    </span>
                    <PriorityBadge priority={p.priority} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {p.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                    {p.description}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-1 mb-3 bg-white dark:bg-slate-800 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Citizen Reporter:
                      </span>
                      <span>{p.citizenName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Location:
                      </span>
                      <span>{p.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <StatusBadge status={p.status} />

                  <button
                    onClick={() => {
                      setSelectedProblemForChat(p);
                      setActiveTab('chat');
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" />
                    Open Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
