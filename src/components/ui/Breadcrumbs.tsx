import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BreadcrumbsProps {
  currentPageTitle?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPageTitle }) => {
  const { currentRole, activeTab, setActiveTab } = useApp();

  const roleLabel = {
    citizen: 'Citizen Portal',
    entrepreneur: 'Entrepreneur Portal',
    admin: 'Admin Portal',
  }[currentRole];

  const formatTabName = (tab: string) => {
    return tab
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 px-1">
      <button
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>{roleLabel}</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />

      <span className="text-slate-800 dark:text-slate-200 font-semibold">
        {currentPageTitle || formatTabName(activeTab)}
      </span>
    </nav>
  );
};
