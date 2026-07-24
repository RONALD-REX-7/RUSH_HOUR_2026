import React, { useState } from 'react';
import { Problem } from '../../types';
import { MapPin, Flame, Layers, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badge';

interface LocationMapProps {
  problems: Problem[];
  onSelectProblem?: (problem: Problem) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({ problems, onSelectProblem }) => {
  const [viewMode, setViewMode] = useState<'pins' | 'heatmap'>('pins');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  const categories = ['All', ...Array.from(new Set(problems.map((p) => p.category)))];

  const filteredProblems = problems.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  // Group by sector for "Most Reported Locations"
  const locationCounts = problems.reduce((acc, p) => {
    const key = p.location.split(',')[0].trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedHotspots = Object.entries(locationCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Control Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('pins')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'pins'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Problem Pinpoints ({filteredProblems.length})
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'heatmap'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            Heat Map Mode
          </button>
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[420px]">
        {/* Map Canvas */}
        <div className="lg:col-span-3 relative bg-slate-100 dark:bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
          {/* Simulated Map Styling with SVG Grid */}
          <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Metro Map Decorative Features */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full text-blue-200 dark:text-blue-950 opacity-40">
              {/* River route */}
              <path
                d="M 0 120 Q 200 180 400 100 T 800 220"
                fill="none"
                stroke="currentColor"
                strokeWidth="24"
              />
              {/* Major Ring Road */}
              <circle
                cx="50%"
                cy="50%"
                r="180"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="6,6"
              />
            </svg>
          </div>

          {/* Pins or Heatmap overlay */}
          <div className="relative w-full h-[380px] flex items-center justify-center">
            {viewMode === 'heatmap' ? (
              /* Heatmap Circles */
              <div className="relative w-full h-full">
                {filteredProblems.map((p, idx) => {
                  const leftPct = 15 + ((idx * 27) % 70);
                  const topPct = 20 + ((idx * 31) % 60);
                  return (
                    <div
                      key={p.id}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"
                    >
                      <div className="w-32 h-32 rounded-full bg-gradient-radial from-rose-500/50 via-amber-500/30 to-transparent blur-md" />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Pinpoints */
              <div className="relative w-full h-full">
                {filteredProblems.map((p, idx) => {
                  const leftPct = 15 + ((idx * 27) % 70);
                  const topPct = 20 + ((idx * 31) % 60);
                  const isSelected = activeProblem?.id === p.id;

                  const pinColor =
                    p.status === 'Solved'
                      ? 'bg-emerald-500 border-emerald-200'
                      : p.status === 'In Progress'
                      ? 'bg-indigo-500 border-indigo-200'
                      : 'bg-rose-500 border-rose-200';

                  return (
                    <div
                      key={p.id}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    >
                      <button
                        onClick={() => {
                          setActiveProblem(p);
                          if (onSelectProblem) onSelectProblem(p);
                        }}
                        className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-white shadow-lg transition-transform transform hover:scale-125 ${pinColor} ${
                          isSelected ? 'ring-4 ring-blue-400 scale-125' : ''
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </button>

                      {/* Tooltip on Hover */}
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                        <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700">
                          <span className="font-bold">{p.id}</span>: {p.title}
                          <div className="text-[10px] text-slate-400">{p.location}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected Pin Popup Card */}
            {activeProblem && (
              <div className="absolute bottom-4 left-4 right-4 max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {activeProblem.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {activeProblem.title}
                    </h4>
                  </div>
                  <PriorityBadge priority={activeProblem.priority} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                  {activeProblem.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{activeProblem.location}</span>
                  <StatusBadge status={activeProblem.status} />
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5" /> Pending
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5" /> In Progress
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Solved
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Metro Geographic Grid v2.4</span>
          </div>
        </div>

        {/* Location Hotspots Sidebar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
              <Navigation className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Most Reported Sectors
            </h4>
            <div className="space-y-2.5">
              {sortedHotspots.map(([loc, count], i) => (
                <div
                  key={loc}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                      {loc}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold text-[11px]">
                    {count} reports
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
              <span>Avg Resolution Time:</span>
              <span className="font-semibold text-slate-900 dark:text-white">18.4 hrs</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Coverage Density:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">96.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
