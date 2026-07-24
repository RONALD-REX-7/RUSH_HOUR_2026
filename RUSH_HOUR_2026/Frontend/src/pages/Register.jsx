import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiBriefcase, FiMapPin } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen', companyName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full glass-card p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
          <p className="text-dark-300">Join the ProblemChain ecosystem</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'citizen'})}
              className={`p-4 rounded-xl border ${formData.role === 'citizen' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'} transition-all text-center`}
            >
              <div className={`font-bold ${formData.role === 'citizen' ? 'text-primary-400' : 'text-white'}`}>Citizen</div>
              <div className="text-xs text-dark-300 mt-1">Report problems</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'entrepreneur'})}
              className={`p-4 rounded-xl border ${formData.role === 'entrepreneur' ? 'border-accent-violet bg-accent-violet/10' : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'} transition-all text-center`}
            >
              <div className={`font-bold ${formData.role === 'entrepreneur' ? 'text-accent-violet' : 'text-white'}`}>Entrepreneur</div>
              <div className="text-xs text-dark-300 mt-1">Solve problems</div>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-dark-400" />
                </div>
                <input 
                  type="text" required placeholder="Full Name"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-dark-400" />
                </div>
                <input 
                  type="email" required placeholder="Email Address"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-dark-400" />
                </div>
                <input 
                  type="password" required placeholder="Password"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            {formData.role === 'entrepreneur' && (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="text-dark-400" />
                  </div>
                  <input 
                    type="text" placeholder="Company Name (Optional)"
                    value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet"
                  />
                </div>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 flex justify-center items-center text-white font-medium rounded-lg transition-all ${
              formData.role === 'citizen' ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400' 
              : 'bg-gradient-to-r from-accent-violet to-purple-500 hover:from-purple-500 hover:to-purple-400'
            }`}
          >
            {loading ? <span className="animate-pulse">Creating account...</span> : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-dark-300">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
