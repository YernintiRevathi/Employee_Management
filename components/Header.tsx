
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-secondary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-text-primary">EMS Dashboard</h1>
          </div>
          <div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
