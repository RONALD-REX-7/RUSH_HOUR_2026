import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import {
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  ArrowRight,
  MapPin,
  Calendar,
  UserCheck,
} from 'lucide-react';

export const CitizenDashboardOverview: React.FC = () => {
  const { problems, currentUser, setActiveTab, setSelectedProblemForChat } = useApp();

  const myProblems = problems.filter((p) => p.citizenId === currentUser?.id);

  const totalSubmitted = myProblems.length;
  const accepted = myProblems.filter((p) => p.status === 'Accepted').length;
  const inProgress = myProblems.filter((p) => p.status === 'In Progress').length;
  const solved = myProblems.filter((p) => p.status === 'Solved').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 max-w-xl z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/20 tracking-wider uppercase">
            Citizen Community Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentUser?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Report local infrastructure issues, road hazards, or service outages. Track live progress and communicate directly with assigned contractors.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report_problem')}
          className="z-10 inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-lg transition-all transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Problems Submitted"
          value={totalSubmitted}
          icon={AlertCircle}
          color="blue"
          description="Total reports logged"
        />
        <StatCard
          title="Problems Accepted"
          value={accepted}
          icon={Clock}
          color="amber"
          description="Assigned to contractor"
        />
        <StatCard
          title="Problems In Progress"
          value={inProgress}
          icon={Clock}
          color="purple"
          description="Active repair crews"
        />
        <StatCard
          title="Problems Solved"
          value={solved}
          icon={CheckCircle2}
          color="green"
          description="Verified resolved"
        />
      </div>

      {/* Recent Problems Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Submitted Problems
            </h3>
            <p className="text-xs text-slate-500">
              Track real-time status and converse with assigned entrepreneurs
            </p>
          </div>

          <button
            onClick={() => setActiveTab('my_problems')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {myProblems.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No problems submitted yet. Click "Report New Problem" above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProblems.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.id}
                    </span>
                    <PriorityBadge priority={p.priority} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {p.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                    {p.description}
                  </p>

                  <div className="flex items-center text-[11px] text-slate-500 space-x-3 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {p.location}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <StatusBadge status={p.status} />

                  {p.assignedEntrepreneurId && (
                    <button
                      onClick={() => {
                        setSelectedProblemForChat(p);
                        setActiveTab('chat');
                      }}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold text-[11px] hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
