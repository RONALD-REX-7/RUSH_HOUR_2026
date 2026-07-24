import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Problem } from '../../types';
import {
  MapPin,
  Calendar,
  Check,
  Eye,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';

export const AvailableProblemsList: React.FC = () => {
  const { problems, acceptProblem, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [detailModalProblem, setDetailModalProblem] = useState<Problem | null>(null);

  const availableProblems = (problems || []).filter((p) => p.status === 'Pending');

  const filtered = availableProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(availableProblems.map((p) => p.category)))];

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search available problem contracts..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Available Problems"
          description="There are currently no unassigned pending problems matching your filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    {p.id}
                  </span>
                  <PriorityBadge priority={p.priority} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {p.description}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-500 mb-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Category:
                    </span>
                    <span>{p.category}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span>Posted: {new Date(p.dateSubmitted).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailModalProblem(p)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>

                <button
                  onClick={() => {
                    acceptProblem(p.id);
                    setActiveTab('accepted_problems');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors flex items-center justify-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Problem</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {detailModalProblem && (
        <Modal
          isOpen={!!detailModalProblem}
          onClose={() => setDetailModalProblem(null)}
          title={`Contract Details - ${detailModalProblem.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {detailModalProblem.title}
              </h3>
              <PriorityBadge priority={detailModalProblem.priority} />
            </div>

            <p className="leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              {detailModalProblem.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <div>
                <span className="font-bold block text-slate-500">Location:</span>
                <span>{detailModalProblem.location}</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Citizen Reporter:</span>
                <span>{detailModalProblem.citizenName}</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Category:</span>
                <span>{detailModalProblem.category}</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Date Posted:</span>
                <span>{new Date(detailModalProblem.dateSubmitted).toLocaleString()}</span>
              </div>
            </div>

            {detailModalProblem.images && detailModalProblem.images.length > 0 && (
              <div>
                <span className="font-bold block mb-2">Attached Problem Photos:</span>
                <div className="grid grid-cols-2 gap-2">
                  {detailModalProblem.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Attachment"
                      className="rounded-xl h-36 w-full object-cover border"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end space-x-2">
              <button
                onClick={() => setDetailModalProblem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  acceptProblem(detailModalProblem.id);
                  setDetailModalProblem(null);
                  setActiveTab('accepted_problems');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Accept This Contract
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
