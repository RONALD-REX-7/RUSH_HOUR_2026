import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/ui/Breadcrumbs';
import { LoginPage } from './components/auth/LoginPage';

// Citizen Views
import { CitizenDashboardOverview } from './components/citizen/CitizenDashboardOverview';
import { ReportProblemForm } from './components/citizen/ReportProblemForm';
import { MyProblemsList } from './components/citizen/MyProblemsList';
import { CitizenChatView } from './components/citizen/CitizenChatView';

// Entrepreneur Views
import { EntrepreneurDashboardOverview } from './components/entrepreneur/EntrepreneurDashboardOverview';
import { AvailableProblemsList } from './components/entrepreneur/AvailableProblemsList';
import { AcceptedProblemsList } from './components/entrepreneur/AcceptedProblemsList';
import { SolvedProblemsList } from './components/entrepreneur/SolvedProblemsList';
import { EntrepreneurChatView } from './components/entrepreneur/EntrepreneurChatView';
import { EntrepreneurEarningsView } from './components/entrepreneur/EntrepreneurEarningsView';

// Admin Views
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { AdminProblemsList } from './components/admin/AdminProblemsList';
import { AssignEntrepreneurView } from './components/admin/AssignEntrepreneurView';
import { ChatMonitoringView } from './components/admin/ChatMonitoringView';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

// Common Views
import { NotificationsPage } from './components/common/NotificationsPage';
import { ProfilePage } from './components/common/ProfilePage';

const AppContent: React.FC = () => {
  const { currentUser, currentRole, activeTab } = useApp();
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    // Common Views regardless of role
    if (activeTab === 'notifications') return <NotificationsPage />;
    if (activeTab === 'profile') return <ProfilePage />;

    // Citizen Portal Views
    if (currentRole === 'citizen') {
      switch (activeTab) {
        case 'dashboard':
          return <CitizenDashboardOverview />;
        case 'report_problem':
          return <ReportProblemForm />;
        case 'my_problems':
          return <MyProblemsList />;
        case 'accepted_problems':
          return <MyProblemsList statusFilterOverride="Accepted" />;
        case 'solved_problems':
          return <MyProblemsList statusFilterOverride="Solved" />;
        case 'chat':
          return <CitizenChatView />;
        default:
          return <CitizenDashboardOverview />;
      }
    }

    // Entrepreneur Portal Views
    if (currentRole === 'entrepreneur') {
      switch (activeTab) {
        case 'dashboard':
          return <EntrepreneurDashboardOverview />;
        case 'available_problems':
          return <AvailableProblemsList />;
        case 'accepted_problems':
        case 'my_work':
          return <AcceptedProblemsList />;
        case 'solved_problems':
          return <SolvedProblemsList />;
        case 'chat':
          return <EntrepreneurChatView />;
        case 'earnings':
          return <EntrepreneurEarningsView />;
        default:
          return <EntrepreneurDashboardOverview />;
      }
    }

    // Admin Portal Views
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboardOverview />;
        case 'citizen_problems':
          return <AdminProblemsList />;
        case 'entrepreneurs':
        case 'assign_problems':
          return <AssignEntrepreneurView />;
        case 'reports':
          return <AnalyticsDashboard />;
        case 'chat_monitoring':
          return <ChatMonitoringView />;
        case 'settings':
          return <AdminSettingsView />;
        default:
          return <AdminDashboardOverview />;
      }
    }

    return <CitizenDashboardOverview />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)} />

      {/* Main Layout Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={isOpenMobileSidebar}
          onCloseMobile={() => setIsOpenMobileSidebar(false)}
        />

        {/* Content View Area */}
        <main className="flex-1 min-w-0">
          <Breadcrumbs />
          <div className="animate-in fade-in duration-200">{renderActiveView()}</div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
