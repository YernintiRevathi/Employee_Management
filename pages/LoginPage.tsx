import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin } from '../services/api';
import UserIcon from '../components/icons/UserIcon';
import KeyIcon from '../components/icons/KeyIcon';
import { useToast } from '../hooks/useToast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await apiLogin(username, password);
      login(token);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-text-primary">
            Employee Management System
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to access your dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full pl-10 pr-3 py-2 text-text-primary bg-accent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition"
              placeholder="Username (e.g., admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeyIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-3 py-2 text-text-primary bg-accent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight focus:border-transparent transition"
              placeholder="Password (e.g., password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-highlight hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;