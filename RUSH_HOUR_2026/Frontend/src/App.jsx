import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages - Lazy Loaded
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));
const EntrepreneurDashboard = lazy(() => import('./pages/EntrepreneurDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ReportProblem = lazy(() => import('./pages/ReportProblem'));
const BrowseOpportunities = lazy(() => import('./pages/BrowseOpportunities'));
const OpportunityDetails = lazy(() => import('./pages/OpportunityDetails'));
const MapExplorer = lazy(() => import('./pages/MapExplorer'));
const ProjectTracking = lazy(() => import('./pages/ProjectTracking'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#25262b',
          color: '#fff',
          border: '1px solid rgba(89, 95, 102, 0.2)',
        },
      }} />
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/citizen/dashboard" element={<ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>} />
            <Route path="/entrepreneur/dashboard" element={<ProtectedRoute role="entrepreneur"><EntrepreneurDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="/report/new" element={<ProtectedRoute role="citizen"><ReportProblem /></ProtectedRoute>} />
            
            <Route path="/opportunities" element={<ProtectedRoute><BrowseOpportunities /></ProtectedRoute>} />
            <Route path="/opportunities/:id" element={<ProtectedRoute><OpportunityDetails /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapExplorer /></ProtectedRoute>} />
            <Route path="/tracking/:id" element={<ProtectedRoute><ProjectTracking /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
