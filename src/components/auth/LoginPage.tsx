import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Users,
  Briefcase,
  Shield,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  UserPlus,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>('citizen');

  // Form states
  const [email, setEmail] = useState('sarah.j@citizen.org');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [createRole, setCreateRole] = useState<Role>('citizen');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Preset demo accounts
  const demoAccounts = {
    citizen: { email: 'sarah.j@citizen.org', name: 'Sarah Jenkins' },
    entrepreneur: { email: 'alex@riverasolutions.com', name: 'Alex Rivera (Civil Contractor)' },
    admin: { email: 'admin@problemchain.gov', name: 'Director James Vance (Civic Admin)' },
  };

  const handleRoleTabClick = (role: Role) => {
    setSelectedRole(role);
    setEmail(demoAccounts[role].email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, email);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForgotModal(false);
    setToastMessage(`Password reset link sent to ${email}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateModal(false);
    login(createRole, newEmail || demoAccounts[createRole].email);
    setToastMessage(`Account created successfully! Welcome to Problem Chain.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header / Brand Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-xl shadow-blue-500/20 mb-3">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Problem<span className="text-blue-600 dark:text-blue-400">Chain</span>
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Empowering Communities to Report, Assign & Resolve Civic Issues
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex space-x-1">
          <button
            onClick={() => handleRoleTabClick('citizen')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole === 'citizen'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Citizen</span>
          </button>

          <button
            onClick={() => handleRoleTabClick('entrepreneur')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole === 'entrepreneur'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Entrepreneur</span>
          </button>

          <button
            onClick={() => handleRoleTabClick('admin')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Form Card Grid */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Modern Illustration & Community Impact */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 border border-white/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Unified Civic Action Portal</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight mb-3">
                {selectedRole === 'citizen' && 'Report Local Issues & Track Real Progress'}
                {selectedRole === 'entrepreneur' && 'Claim Civic Contracts & Earn Revenue'}
                {selectedRole === 'admin' && 'Supervise Municipal Operations & Analytics'}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Connect directly with local municipal bodies and specialized contractors. Transparent status tracking, direct chat, and verified resolution guarantee.
              </p>
            </div>

            {/* Vector Community Illustration SVG */}
            <div className="my-4 flex items-center justify-center">
              <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs drop-shadow-xl">
                <rect width="320" height="180" rx="16" fill="white" fillOpacity="0.05" />
                {/* Road */}
                <path d="M0 140 H320" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" />
                {/* Buildings */}
                <rect x="30" y="60" width="40" height="80" rx="4" fill="#60A5FA" fillOpacity="0.8" />
                <rect x="80" y="40" width="50" height="100" rx="4" fill="#34D399" fillOpacity="0.8" />
                <rect x="140" y="70" width="45" height="70" rx="4" fill="#818CF8" fillOpacity="0.8" />
                <rect x="200" y="50" width="55" height="90" rx="4" fill="#FBBF24" fillOpacity="0.8" />
                {/* Connecting Chain Nodes */}
                <circle cx="50" cy="100" r="14" fill="#2563EB" />
                <circle cx="160" cy="100" r="14" fill="#059669" />
                <circle cx="270" cy="100" r="14" fill="#7C3AED" />
                <path d="M64 100 H146" stroke="white" strokeWidth="3" strokeDasharray="4 4" />
                <path d="M174 100 H256" stroke="white" strokeWidth="3" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* Quick Demo Autofill Hint */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs">
              <span className="font-bold text-emerald-300">Demo Credentials:</span>{' '}
              <span className="text-slate-200">{demoAccounts[selectedRole].name}</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                {selectedRole} Portal Login
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to manage community problem reports.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Login to {selectedRole.toUpperCase()} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Create Account Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  New to Problem Chain?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        maxWidth="sm"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Enter your email address and we will send you a password recovery code.
          </p>
          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
          >
            Send Recovery Link
          </button>
        </form>
      </Modal>

      {/* Create Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Problem Chain Account"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['citizen', 'entrepreneur', 'admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCreateRole(r)}
                  className={`py-2 text-xs font-bold rounded-lg border capitalize ${
                    createRole === r
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-md"
          >
            Register Account
          </button>
        </form>
      </Modal>
    </div>
  );
};
