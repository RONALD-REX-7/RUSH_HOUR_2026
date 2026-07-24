import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Problem } from '../../types';
import {
  Search,
  UserCheck,
  Eye,
  MapPin,
  Calendar,
  Filter,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const AdminProblemsList: React.FC = () => {
  const { problems, entrepreneurs, assignEntrepreneur, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [assignProblem, setAssignProblem] = useState<Problem | null>(null);
  const [selectedEntrepreneurId, setSelectedEntrepreneurId] = useState<string>('');
  const [detailProblem, setDetailProblem] = useState<Problem | null>(null);

  const safeProblems = problems || [];
  const safeEntrepreneurs = entrepreneurs || [];

  const filteredProblems = safeProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(safeProblems.map((p) => p.category)))];

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignProblem || !selectedEntrepreneurId) return;
    assignEntrepreneur(assignProblem.id, selectedEntrepreneurId);
    setAssignProblem(null);
    setSelectedEntrepreneurId('');
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problem ID, title, citizen name, or area..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {['All', 'Pending', 'Accepted', 'In Progress', 'Solved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  statusFilter === s
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Problem ID</th>
                <th className="py-3.5 px-4">Citizen Name</th>
                <th className="py-3.5 px-4">Title & Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority & Status</th>
                <th className="py-3.5 px-4">Assigned Contractor</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProblems.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {p.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {p.citizenName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{p.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {p.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col space-y-1 items-start">
                      <PriorityBadge priority={p.priority} />
                      <StatusBadge status={p.status} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {p.assignedEntrepreneurName ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {p.assignedEntrepreneurName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setDetailProblem(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setAssignProblem(p);
                          setSelectedEntrepreneurId(entrepreneurs[0]?.id || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assignProblem && (
        <Modal
          isOpen={!!assignProblem}
          onClose={() => setAssignProblem(null)}
          title={`Assign Contractor to ${assignProblem.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmAssign} className="space-y-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 text-xs">
              <span className="font-bold block text-purple-900 dark:text-purple-300">
                {assignProblem.title}
              </span>
              <span className="text-slate-500">{assignProblem.category} • {assignProblem.location}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2">Select Entrepreneur Agency</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {entrepreneurs.map((ent) => (
                  <label
                    key={ent.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                      selectedEntrepreneurId === ent.id
                        ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="entrepreneur"
                        checked={selectedEntrepreneurId === ent.id}
                        onChange={() => setSelectedEntrepreneurId(ent.id)}
                        className="text-purple-600"
                      />
                      <img
                        src={ent.avatar}
                        alt={ent.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="block font-bold">{ent.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {ent.skills?.join(', ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500">★ {ent.rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Confirm Assignment
            </button>
          </form>
        </Modal>
      )}

      {/* Detail Modal */}
      {detailProblem && (
        <Modal
          isOpen={!!detailProblem}
          onClose={() => setDetailProblem(null)}
          title={`Problem Details - ${detailProblem.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {detailProblem.title}
              </h3>
              <PriorityBadge priority={detailProblem.priority} />
            </div>

            <p className="leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              {detailProblem.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <div>
                <span className="font-bold text-slate-500 block">Citizen Reporter:</span>
                <span>{detailProblem.citizenName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block">Category:</span>
                <span>{detailProblem.category}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block">Location:</span>
                <span>{detailProblem.location}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block">Status:</span>
                <StatusBadge status={detailProblem.status} />
              </div>
            </div>

            {detailProblem.images && detailProblem.images.length > 0 && (
              <div>
                <span className="font-bold block mb-2">Reported Photos:</span>
                <div className="grid grid-cols-2 gap-2">
                  {detailProblem.images.map((img, i) => (
                    <img key={i} src={img} alt="Reported" className="rounded-xl h-36 w-full object-cover border" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
