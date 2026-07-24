import React, { useState } from 'react';
import { Problem } from '../../types';
import {
  MapPin,
  Flame,
  Globe,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Layers,
  BarChart2,
  TrendingUp,
  Clock,
  Filter,
  X,
  Zap,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badge';
import { INDIAN_STATES, IndianState } from '../../data/indiaStatesData';

interface LocationMapProps {
  problems: Problem[];
  onSelectProblem?: (problem: Problem) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({ problems = [], onSelectProblem }) => {
  const [viewMode, setViewMode] = useState<'choropleth' | 'pins' | 'heatmap'>('choropleth');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const safeProblems = problems || [];
  const categories = ['All', ...Array.from(new Set(safeProblems.map((p) => p.category)))];

  const filteredProblems = safeProblems.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  // Group problems by state deterministically & calculate state statistics
  const stateStats = INDIAN_STATES.map((state, idx) => {
    const matchedProblems = filteredProblems.filter((p) => {
      const loc = p.location.toLowerCase();
      const hasKeyword = state.keywords.some((k) => loc.includes(k.toLowerCase()));
      if (hasKeyword) return true;
      // Fallback distribution for demo data
      const charCodeSum = p.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return charCodeSum % INDIAN_STATES.length === idx;
    });

    const totalProblems = matchedProblems.length;
    const pendingCount = matchedProblems.filter((p) => p.status === 'Pending').length;
    const inProgressCount = matchedProblems.filter((p) => p.status === 'In Progress').length;
    const solvedCount = matchedProblems.filter((p) => p.status === 'Solved').length;

    // Determine top sector dynamically or fallback
    const sectorCounts: Record<string, number> = {};
    matchedProblems.forEach((p) => {
      sectorCounts[p.category] = (sectorCounts[p.category] || 0) + 1;
    });
    const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
    const topPerformingSector = sortedSectors.length > 0 ? sortedSectors[0][0] : state.defaultTopSector;

    // Number of listed companies / contractors in state
    const listedCompaniesCount = state.defaultListedCompanies + Math.round(totalProblems * 1.5);

    return {
      ...state,
      matchedProblems,
      totalProblems,
      pendingCount,
      inProgressCount,
      solvedCount,
      topPerformingSector,
      listedCompaniesCount,
    };
  });

  // Color helper based on number of problems (Green, Yellow, Orange, Red)
  const getStateProblemColor = (problemCount: number) => {
    if (problemCount >= 15) {
      return {
        fill: 'fill-red-600/85',
        stroke: 'stroke-red-400',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
        dotColor: 'bg-red-500',
        name: 'Critical Area (15+ issues)',
        hex: '#ef4444',
      };
    }
    if (problemCount >= 10) {
      return {
        fill: 'fill-orange-500/80',
        stroke: 'stroke-orange-300',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        dotColor: 'bg-orange-500',
        name: 'High Density (10-14 issues)',
        hex: '#f97316',
      };
    }
    if (problemCount >= 5) {
      return {
        fill: 'fill-yellow-400/75',
        stroke: 'stroke-yellow-200',
        badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        dotColor: 'bg-yellow-400',
        name: 'Moderate Density (5-9 issues)',
        hex: '#facc15',
      };
    }
    return {
      fill: 'fill-emerald-500/70',
      stroke: 'stroke-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotColor: 'bg-emerald-500',
      name: 'Low Density (<5 issues)',
      hex: '#10b981',
    };
  };

  const hoveredStateData = stateStats.find((s) => s.id === hoveredStateId);
  const selectedStateData = stateStats.find((s) => s.id === selectedStateId);

  // Group location hotspots for sidebar fallback
  const locationCounts = safeProblems.reduce((acc, p) => {
    const key = p.location.split(',')[0].trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedHotspots = Object.entries(locationCounts)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Control Header Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <button
            onClick={() => setViewMode('choropleth')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              viewMode === 'choropleth'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
            India Interactive Choropleth Map
          </button>
          <button
            onClick={() => setViewMode('pins')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              viewMode === 'pins'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            State Pinpoints ({filteredProblems.length})
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95 ${
              viewMode === 'heatmap'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            Issue Heatmap
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Category Filter:</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[460px]">
        {/* Main India Map Canvas */}
        <div className="lg:col-span-3 relative bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
          {/* Tech Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="indiaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#indiaGrid)" />
            </svg>
          </div>

          {/* Interactive SVG India States Map */}
          <div className="relative w-full h-[400px] flex items-center justify-center">
            <svg viewBox="100 0 800 600" className="w-full h-full max-h-[400px]">
              {/* Outer India Geographic Boundary Glow */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Render Indian States */}
              {stateStats.map((state) => {
                const colorInfo = getStateProblemColor(state.totalProblems);
                const isHovered = hoveredStateId === state.id;
                const isSelected = selectedStateId === state.id;

                return (
                  <g key={state.id} className="cursor-pointer group">
                    <path
                      d={state.path}
                      className={`${colorInfo.fill} stroke-1.5 ${colorInfo.stroke} transition-all duration-200 ${
                        isHovered || isSelected
                          ? 'fill-opacity-100 stroke-white stroke-[3px] filter drop-shadow-xl z-30'
                          : 'hover:fill-opacity-90'
                      }`}
                      onMouseEnter={() => setHoveredStateId(state.id)}
                      onMouseLeave={() => setHoveredStateId(null)}
                      onClick={() => setSelectedStateId(isSelected ? null : state.id)}
                    />

                    {/* State Code Badge */}
                    {viewMode === 'choropleth' && (
                      <g
                        transform={`translate(${state.labelX}, ${state.labelY})`}
                        className="pointer-events-none"
                      >
                        <circle
                          r="11"
                          fill="#0f172a"
                          fillOpacity="0.85"
                          stroke={isHovered || isSelected ? '#ffffff' : '#475569'}
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {state.code}
                        </text>
                      </g>
                    )}

                    {/* Pin Mode Overlay */}
                    {viewMode === 'pins' && (
                      <g transform={`translate(${state.labelX}, ${state.labelY})`} className="pointer-events-none">
                        <circle r="6" fill={colorInfo.hex} stroke="#ffffff" strokeWidth="2" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card (Exact Prompt Specifications) */}
            {hoveredStateData && (
              <div className="absolute top-4 right-4 z-40 bg-slate-900/95 text-white border border-slate-700/80 backdrop-blur-md rounded-xl p-4 shadow-2xl max-w-xs animate-in fade-in duration-150 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                      {hoveredStateData.code} • Indian State
                    </span>
                    <h3 className="text-sm font-black text-white">{hoveredStateData.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      getStateProblemColor(hoveredStateData.totalProblems).badgeBg
                    }`}
                  >
                    {getStateProblemColor(hoveredStateData.totalProblems).name}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* State Name */}
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400 font-medium">State Capital:</span>
                    <span className="font-bold text-white">{hoveredStateData.capital}</span>
                  </div>

                  {/* AI No. of Problems */}
                  <div className="flex justify-between items-center bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-300 font-medium flex items-center">
                      <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      AI No. of Problems:
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      {hoveredStateData.totalProblems} Reported
                    </span>
                  </div>

                  {/* Top Performing Sector */}
                  <div className="flex flex-col bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                      Top Performing Sector
                    </span>
                    <span className="font-semibold text-emerald-400 text-xs">
                      {hoveredStateData.topPerformingSector}
                    </span>
                  </div>

                  {/* Number of Listed Companies */}
                  <div className="flex justify-between items-center text-slate-300 pt-0.5">
                    <span className="text-slate-400 font-medium flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-blue-400" />
                      Listed Companies / Contractors:
                    </span>
                    <span className="font-bold text-white">
                      {hoveredStateData.listedCompaniesCount} Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Legend Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="font-bold text-slate-300">AI Problem Density Legend:</span>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" /> Green (&lt;5)
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5" /> Yellow (5-9)
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mr-1.5" /> Orange (10-14)
                </span>
                <span className="flex items-center text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-red-600 mr-1.5" /> Red (15+)
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-blue-400">Interactive India State Choropleth v3.0</span>
          </div>
        </div>

        {/* Selected State Detail / Hotspots Sidebar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            {selectedStateData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {selectedStateData.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedStateData.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedStateId(null)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* State Statistics Box */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50">
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      AI Problems
                    </div>
                    <div className="text-lg font-black text-blue-900 dark:text-blue-100">
                      {selectedStateData.totalProblems}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Listed Companies
                    </div>
                    <div className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                      {selectedStateData.listedCompaniesCount}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Top Performing Sector
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedStateData.topPerformingSector}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 pt-1">
                  Active State Reports ({selectedStateData.matchedProblems.length})
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedStateData.matchedProblems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProblem(p);
                        if (onSelectProblem) onSelectProblem(p);
                      }}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs hover:border-blue-500 cursor-pointer transition-colors shadow-2xs"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{p.id}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                        {p.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                  <Navigation className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Top Reported Regions
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
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
              <span>National Grid Resolution:</span>
              <span className="font-semibold text-slate-900 dark:text-white">18.4 hrs</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>State Analytics Coverage:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% (28 States)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
