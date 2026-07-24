import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Problem, ProblemStatus } from '../../types';
import {
  Search,
  Filter,
  MessageSquare,
  MapPin,
  Calendar,
  UserCheck,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';

interface MyProblemsListProps {
  statusFilterOverride?: ProblemStatus;
}

export const MyProblemsList: React.FC<MyProblemsListProps> = ({ statusFilterOverride }) => {
  const { problems, currentUser, setActiveTab, setSelectedProblemForChat, submitCitizenRating } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFilterOverride || 'All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Rating modal states
  const [ratingProblem, setRatingProblem] = useState<Problem | null>(null);
  const [starCount, setStarCount] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const myProblems = problems.filter((p) => p.citizenId === currentUser?.id);

  const filteredProblems = myProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(myProblems.map((p) => p.category)))];

  const handleOpenRatingModal = (problem: Problem) => {
    setRatingProblem(problem);
    setStarCount(problem.citizenRating || 5);
    setFeedbackText(problem.citizenFeedback || '');
  };

  const handleSaveRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingProblem) return;
    submitCitizenRating(ratingProblem.id, starCount, feedbackText);
    setRatingProblem(null);
  };

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
            placeholder="Search problem ID, title, or location..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {['All', 'Pending', 'Accepted', 'In Progress', 'Solved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
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
      </div>

      {/* Cards List */}
      {filteredProblems.length === 0 ? (
        <EmptyState
          title="No Problems Found"
          description="You haven't reported any problems matching this criteria."
          actionLabel="Report New Problem"
          onAction={() => setActiveTab('report_problem')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200/50">
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
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    <span>Submitted: {new Date(p.dateSubmitted).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Assigned Entrepreneur block if accepted */}
                {p.assignedEntrepreneurName && (
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={p.assignedEntrepreneurAvatar}
                        alt={p.assignedEntrepreneurName}
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                          Assigned Entrepreneur
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {p.assignedEntrepreneurName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <StatusBadge status={p.status} />

                <div className="flex items-center space-x-2">
                  {p.status === 'Solved' && (
                    <button
                      onClick={() => handleOpenRatingModal(p)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold hover:bg-amber-100 flex items-center"
                    >
                      <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
                      {p.citizenRating ? `${p.citizenRating}★ Feedback` : 'Rate Resolution'}
                    </button>
                  )}

                  {p.assignedEntrepreneurId && (
                    <button
                      onClick={() => {
                        setSelectedProblemForChat(p);
                        setActiveTab('chat');
                      }}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Citizen Rating Modal */}
      {ratingProblem && (
        <Modal
          isOpen={!!ratingProblem}
          onClose={() => setRatingProblem(null)}
          title={`Rate Entrepreneur Resolution - ${ratingProblem.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveRating} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Your feedback helps evaluate entrepreneur performance and municipal resolution quality.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarCount(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= starCount
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Feedback / Comments</label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="How satisfied are you with the repair speed and work quality?"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
            >
              Submit Citizen Rating
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
