import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import {
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  Shield,
  BarChart3,
  UserCheck,
  Eye,
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { problems, entrepreneurs, setActiveTab, setSelectedProblemForChat } = useApp();

  const totalProblems = problems.length;
  const solved = problems.filter((p) => p.status === 'Solved').length;
  const pending = problems.filter((p) => p.status === 'Pending').length;
  const inProgress = problems.filter((p) => p.status === 'In Progress').length;
  const totalCitizens = 148;
  const totalEntrepreneurs = entrepreneurs.length || 3;
  const activeUsers = 182;

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/20 tracking-wider uppercase">
            Municipal Administrative Command Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Metro City Civic Operations
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            Oversee civic problem submissions, allocate contractor resources, monitor active chat logs, and analyze municipal resolution benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 z-10">
          <button
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs shadow-md hover:bg-purple-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('assign_problems')}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Assign Entrepreneurs</span>
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Citizens"
          value={totalCitizens}
          icon={Users}
          color="blue"
          description="Registered reporters"
        />
        <StatCard
          title="Total Entrepreneurs"
          value={totalEntrepreneurs}
          icon={Briefcase}
          color="green"
          description="Verified contractors"
        />
        <StatCard
          title="Total Problems"
          value={totalProblems}
          icon={AlertCircle}
          color="purple"
          description="Cumulative submissions"
        />
        <StatCard
          title="Problems Solved"
          value={solved}
          icon={CheckCircle2}
          color="green"
          description="Completed repairs"
        />
        <StatCard
          title="Pending Problems"
          value={pending}
          icon={Clock}
          color="rose"
          description="Awaiting assignment"
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={Activity}
          color="amber"
          description="Live online citizens"
        />
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Urgent Problems */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Citizen Submissions
              </h3>
              <p className="text-xs text-slate-500">
                Requires admin review & contractor dispatch
              </p>
            </div>

            <button
              onClick={() => setActiveTab('citizen_problems')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {problems
              .filter((p) => p.status === 'Pending')
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {p.id}
                      </span>
                      <PriorityBadge priority={p.priority} />
                      <span className="text-[10px] text-slate-400">• {p.category}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{p.title}</h4>
                    <p className="text-[11px] text-slate-500">{p.location}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('assign_problems')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 shadow-xs"
                  >
                    Assign Contractor
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Live Chat Monitor Shortcut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase mb-2">
              <Eye className="w-4 h-4" />
              <span>Real-Time Supervision</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Chat & Audit Log Monitor
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Audit active communication channels between citizens and local contractors to ensure compliance, etiquette, and prompt repair schedules.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('chat_monitoring')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Open Chat Monitor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
