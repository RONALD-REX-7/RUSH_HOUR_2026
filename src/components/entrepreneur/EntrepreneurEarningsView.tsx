import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import {
  DollarSign,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Calendar,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const EntrepreneurEarningsView: React.FC = () => {
  const { currentUser, problems } = useApp();

  const mySolved = problems.filter(
    (p) => p.assignedEntrepreneurId === currentUser?.id && p.status === 'Solved'
  );

  const completedJobs = mySolved.length || currentUser?.completedJobs || 12;
  const monthlyEarnings = currentUser?.monthlyEarnings || 8450;
  const estimatedTotalRevenue = completedJobs * 1250;
  const rating = currentUser?.rating || 4.9;

  const monthlyHistory = [
    { month: 'Feb', earnings: 4200 },
    { month: 'Mar', earnings: 5800 },
    { month: 'Apr', earnings: 6400 },
    { month: 'May', earnings: 7100 },
    { month: 'Jun', earnings: 7900 },
    { month: 'Jul', earnings: monthlyEarnings },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Earnings"
          value={`$${monthlyEarnings.toLocaleString()}`}
          change="+14%"
          icon={DollarSign}
          color="green"
          description="Current month payout"
        />
        <StatCard
          title="Total Estimated Revenue"
          value={`$${estimatedTotalRevenue.toLocaleString()}`}
          change="+22%"
          icon={TrendingUp}
          color="blue"
          description="Lifetime civic contracts"
        />
        <StatCard
          title="Completed Jobs"
          value={completedJobs}
          icon={CheckCircle2}
          color="purple"
          description="Verified repair projects"
        />
        <StatCard
          title="Customer Rating"
          value={`${rating} / 5.0`}
          icon={Star}
          color="amber"
          description="Average citizen satisfaction"
        />
      </div>

      {/* Chart & Statement Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Payout & Revenue Trend
              </h3>
              <p className="text-xs text-slate-500">
                Civic contract compensation disbursed upon citizen inspection sign-off
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${value}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agency Rating & Badge Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-3">
              <Award className="w-4 h-4" />
              <span>Certified Premier Contractor</span>
            </div>

            <h3 className="text-xl font-black mb-2">Municipal Service Grade: A+</h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Your contractor agency ranks in the top 5% for response speed and resolution satisfaction in Metro City.
            </p>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">On-Time Arrival:</span>
                <span className="font-bold text-emerald-300">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">First-Time Fix Rate:</span>
                <span className="font-bold text-emerald-300">96.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Citizen Satisfaction:</span>
                <span className="font-bold text-emerald-300">4.9 / 5</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Payout Statement PDF exported successfully!')}
            className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white shadow-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Tax & Payout Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
