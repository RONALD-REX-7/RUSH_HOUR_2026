import React, { useState } from 'react';
import { Settings, Shield, Bell, Save, CheckCircle2, Sliders } from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [autoAssign, setAutoAssign] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [highPriorityThresholdHours, setHighPriorityThresholdHours] = useState(12);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showSavedToast && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-semibold">System settings saved successfully!</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Platform & Operational Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure municipal dispatch rules, alert thresholds, and system preferences
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Dispatch Rules */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contractor Dispatch Configuration
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Automatic AI Skill-Matching Dispatch
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatically suggest the nearest contractor based on problem category & rating
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                High Priority Escalation SLA (Hours)
              </label>
              <input
                type="number"
                value={highPriorityThresholdHours}
                onChange={(e) => setHighPriorityThresholdHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Reports unresolved after this threshold trigger urgent SMS alerts to Department Directors.
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Notification Channels
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  SMS & Push Dispatch Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  Broadcast instant alerts to contractor mobile devices upon assignment
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Admin Configurations</span>
          </button>
        </form>
      </div>
    </div>
  );
};
