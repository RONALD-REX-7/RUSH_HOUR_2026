import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { LocationMap } from '../ui/LocationMap';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Briefcase,
  Star,
  MapPin,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  mockCategoryData,
  mockMonthlyReports,
  mockDailyResolution,
} from '../../data/mockData';

export const AnalyticsDashboard: React.FC = () => {
  const { problems, entrepreneurs, entrepreneurPerformances } = useApp();

  const totalProblems = problems.length || 152;
  const solvedProblems = problems.filter((p) => p.status === 'Solved').length || 134;
  const pendingProblems = problems.filter((p) => p.status === 'Pending').length || 18;
  const activeEntrepreneurs = entrepreneurs.length || 14;
  const activeCitizens = 148;
  const avgResolutionTime = '18.4 hrs';
  const successRate = '94.2%';

  // Data for Bar Chart: Category Resolution Volume
  const categoryResolutionData = mockCategoryData.map((cat) => ({
    name: cat.category.split(' ')[0],
    count: cat.count,
    color: cat.color,
  }));

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Municipal Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time urban infrastructure resolution performance metrics & world location heatmap
          </p>
        </div>
      </div>

      {/* 7 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard
          title="Total Problems"
          value={totalProblems}
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Solved"
          value={solvedProblems}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Pending"
          value={pendingProblems}
          icon={Clock}
          color="rose"
        />
        <StatCard
          title="Entrepreneurs"
          value={activeEntrepreneurs}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Citizens"
          value={activeCitizens}
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Avg Time"
          value={avgResolutionTime}
          icon={Clock}
          color="slate"
        />
        <StatCard
          title="Success Rate"
          value={successRate}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Four Core Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Pie Chart: Problems by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                1. Problems by Category
              </h3>
              <p className="text-[11px] text-slate-500">Proportional breakdown of issue types</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                  label={({ category, percent }) =>
                    `${category} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bar Chart: Resolution Volume by Sector Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Resolution Volume by Category
              </h3>
              <p className="text-[11px] text-slate-500">
                Logged civic maintenance volume breakdown across urban departments
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryResolutionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Reported Issues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Line Chart: Monthly Problem Reports */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Monthly Problem Reports & Solved Trend
              </h3>
              <p className="text-[11px] text-slate-500">
                Growth curve comparing logged reports vs completed repairs
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyReports}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Reports Submitted"
                />
                <Line
                  type="monotone"
                  dataKey="solved"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Reports Solved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Area Graph: Daily Problem Resolution Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                4. Daily Problem Resolution Trend
              </h3>
              <p className="text-[11px] text-slate-500">
                Weekly velocity of resolved vs in-progress field work
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDailyResolution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                  name="Resolved"
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                  name="In Progress"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Location Analytics Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Location Analytics & World Geographic Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Interactive geographic problem distribution across world sectors
            </p>
          </div>
        </div>

        <LocationMap problems={problems} />
      </div>
    </div>
  );
};
