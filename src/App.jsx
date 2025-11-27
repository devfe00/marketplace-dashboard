import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Plans from './pages/Plans';
import { getNotifications } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const response = await getNotifications({ read: false });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'notifications':
        return <Notifications />;
      case 'plans':
        return <Plans />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;