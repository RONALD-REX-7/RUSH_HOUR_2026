import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatWindow } from '../chat/ChatWindow';
import { Eye, Shield, MessageSquare, Search } from 'lucide-react';

export const ChatMonitoringView: React.FC = () => {
  const { problems, chats } = useApp();

  const [search, setSearch] = useState('');

  // Active chat channels exist for problems that have assigned entrepreneurs
  const monitoredProblems = (problems || []).filter((p) => p.assignedEntrepreneurId);

  const [activeProblem, setActiveProblem] = useState(monitoredProblems[0] || null);

  const filteredMonitored = monitoredProblems.filter((p) => {
    return (
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      (p.assignedEntrepreneurName &&
        p.assignedEntrepreneurName.toLowerCase().includes(search.toLowerCase())) ||
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400">
          <Shield className="w-4 h-4" />
          <span>Real-Time Admin Chat Supervision Panel</span>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Monitored Channels Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Active Chat Channels ({filteredMonitored.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredMonitored.map((p) => {
              const isSelected = activeProblem?.id === p.id;
              const msgCount = (chats || []).filter((c) => c.problemId === p.id).length;

              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProblem(p)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 font-semibold'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                      {p.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-200 dark:bg-slate-700 font-bold">
                      {msgCount} msgs
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {p.title}
                  </h4>

                  <div className="space-y-0.5 text-[10px] text-slate-500">
                    <p>
                      Citizen:{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {p.citizenName}
                      </span>
                    </p>
                    <p>
                      Contractor:{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {p.assignedEntrepreneurName}
                      </span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="lg:col-span-3">
          {activeProblem ? (
            <ChatWindow problem={activeProblem} isReadOnly={true} />
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a conversation channel to audit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
