
import React from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {token ? <DashboardPage /> : <LoginPage />}
    </div>
  );
};

export default App;
