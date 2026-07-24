import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChatWindow } from '../chat/ChatWindow';
import { EmptyState } from '../ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export const CitizenChatView: React.FC = () => {
  const { problems, currentUser, selectedProblemForChat, setSelectedProblemForChat, setActiveTab } =
    useApp();

  // Citizen can chat for problems that have been accepted by an entrepreneur
  const chatableProblems = problems.filter(
    (p) => p.citizenId === currentUser?.id && p.assignedEntrepreneurId
  );

  const activeProblem = selectedProblemForChat || chatableProblems[0] || null;

  if (chatableProblems.length === 0) {
    return (
      <EmptyState
        title="No Active Chats"
        description="Chats become available once your reported problem is accepted or assigned to an entrepreneur."
        icon={MessageSquare}
        actionLabel="View My Submitted Problems"
        onAction={() => setActiveTab('my_problems')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Problem Conversations Sidebar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Problem Discussions ({chatableProblems.length})
        </h3>

        <div className="space-y-2">
          {chatableProblems.map((p) => {
            const isSelected = activeProblem?.id === p.id;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProblemForChat(p)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 font-semibold'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {p.id}
                  </span>
                  <span className="text-[10px] text-slate-400">{p.category}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                  {p.title}
                </h4>
                <div className="flex items-center text-[10px] text-slate-500 space-x-1">
                  <span>Contractor:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {p.assignedEntrepreneurName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat Window */}
      <div className="lg:col-span-3">
        {activeProblem ? (
          <ChatWindow problem={activeProblem} />
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-slate-400 text-xs">
            Select a problem from the list to view conversation
          </div>
        )}
      </div>
    </div>
  );
};
