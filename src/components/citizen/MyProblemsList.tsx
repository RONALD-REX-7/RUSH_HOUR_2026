import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Problem, ProblemStatus, Category, Priority } from '../../types';
import {
  Search,
  Filter,
  MessageSquare,
  MapPin,
  Calendar,
  UserCheck,
  Star,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';

interface MyProblemsListProps {
  viewMode?: 'my_problems' | 'accepted_problems' | 'solved_problems';
  statusFilterOverride?: ProblemStatus;
}

export const MyProblemsList: React.FC<MyProblemsListProps> = ({ viewMode, statusFilterOverride }) => {
  const {
    problems,
    currentUser,
    setActiveTab,
    setSelectedProblemForChat,
    submitCitizenRating,
    editProblem,
    deleteProblem,
  } = useApp();

  // Determine effective view mode
  const effectiveViewMode = viewMode || (statusFilterOverride === 'Accepted' ? 'accepted_problems' : statusFilterOverride === 'Solved' ? 'solved_problems' : 'my_problems');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Rating modal states
  const [ratingProblem, setRatingProblem] = useState<Problem | null>(null);
  const [starCount, setStarCount] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Edit modal states
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('Roads');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('Medium');

  // Delete confirm modal state
  const [deleteConfirmProblem, setDeleteConfirmProblem] = useState<Problem | null>(null);

  const myProblems = (problems || []).filter((p) => p.citizenId === currentUser?.id);

  // Apply strict viewMode base filter
  const baseViewProblems = myProblems.filter((p) => {
    if (effectiveViewMode === 'my_problems') {
      // Exclude Solved and Accepted problems
      return p.status !== 'Solved' && p.status !== 'Accepted';
    }
    if (effectiveViewMode === 'accepted_problems') {
      // Only Accepted problems
      return p.status === 'Accepted';
    }
    if (effectiveViewMode === 'solved_problems') {
      // Only Solved problems
      return p.status === 'Solved';
    }
    return true;
  });

  const filteredProblems = baseViewProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(myProblems.map((p) => p.category)))];

  const handleOpenEditModal = (problem: Problem) => {
    setEditingProblem(problem);
    setEditTitle(problem.title);
    setEditCategory(problem.category);
    setEditDescription(problem.description);
    setEditLocation(problem.location);
    setEditPriority(problem.priority);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem || !editTitle.trim() || !editDescription.trim() || !editLocation.trim()) return;

    editProblem(editingProblem.id, {
      title: editTitle.trim(),
      category: editCategory,
      description: editDescription.trim(),
      location: editLocation.trim(),
      priority: editPriority,
    });

    setEditingProblem(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmProblem) return;
    deleteProblem(deleteConfirmProblem.id);
    setDeleteConfirmProblem(null);
  };

  const handleSaveRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingProblem) return;
    submitCitizenRating(ratingProblem.id, starCount, feedbackText);
    setRatingProblem(null);
  };

  const handleOpenRatingModal = (problem: Problem) => {
    setRatingProblem(problem);
    setStarCount(problem.citizenRating || 5);
    setFeedbackText(problem.citizenFeedback || '');
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
          {/* Status Filter for my_problems */}
          {effectiveViewMode === 'my_problems' && (
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {['All', 'Pending', 'In Progress'].map((st) => (
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
          )}

          {/* Section Indicator Badge for Accepted & Solved views */}
          {effectiveViewMode === 'accepted_problems' && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Accepted Problems ({filteredProblems.length})
            </span>
          )}

          {effectiveViewMode === 'solved_problems' && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Solved Problems ({filteredProblems.length})
            </span>
          )}

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

      {/* Rows List */}
      {filteredProblems.length === 0 ? (
        <EmptyState
          title={
            effectiveViewMode === 'accepted_problems'
              ? 'No Accepted Problems'
              : effectiveViewMode === 'solved_problems'
              ? 'No Solved Problems'
              : 'No Problems Found'
          }
          description={
            effectiveViewMode === 'accepted_problems'
              ? 'None of your submitted problems have been accepted yet.'
              : effectiveViewMode === 'solved_problems'
              ? 'None of your submitted problems have been marked as solved yet.'
              : "You don't have any pending or in-progress reported problems."
          }
          actionLabel="Report New Problem"
          onAction={() => setActiveTab('report_problem')}
        />
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200/50">
                    {p.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {p.category}
                  </span>

                  {/* Levels (Priority) - Shown ONLY in my_problems view (NOT in accepted_problems or solved_problems) */}
                  {effectiveViewMode === 'my_problems' && (
                    <PriorityBadge priority={p.priority} />
                  )}

                  {/* Processing / Status Badge */}
                  <StatusBadge status={p.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span>Submitted: {new Date(p.dateSubmitted).toLocaleDateString()}</span>
                  </div>
                  {p.assignedEntrepreneurName && (
                    <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                      <span className="mr-1">Assigned:</span>
                      <span>{p.assignedEntrepreneurName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row Actions */}
              <div className="flex items-center space-x-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800 justify-end">
                {p.status === 'Solved' && (
                  <button
                    onClick={() => handleOpenRatingModal(p)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center transition-colors"
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

                {p.status !== 'Solved' && (
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    title="Edit Problem"
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setDeleteConfirmProblem(p)}
                  title="Remove Problem"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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

      {/* Edit Problem Modal */}
      {editingProblem && (
        <Modal
          isOpen={!!editingProblem}
          onClose={() => setEditingProblem(null)}
          title={`Edit Problem Report - ${editingProblem.id}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Problem Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                >
                  {['Roads', 'Water & Sanitation', 'Public Safety', 'Street Lighting', 'Waste Management', 'Parks & Environment', 'Daily Life Issues', 'Healthcare', 'Education', 'Others'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Location Address</label>
              <input
                type="text"
                required
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProblem(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProblem && (
        <Modal
          isOpen={!!deleteConfirmProblem}
          onClose={() => setDeleteConfirmProblem(null)}
          title={`Remove Problem Report - ${deleteConfirmProblem.id}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-6 h-6 shrink-0 text-rose-600" />
              <p className="text-xs">
                Are you sure you want to remove <span className="font-bold">"{deleteConfirmProblem.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProblem(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
              >
                Yes, Remove Problem
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
