import { Bell, Package, ShoppingCart, BarChart3, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ currentPage, setCurrentPage, unreadCount }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'plans', label: 'Planos', icon: CreditCard },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-8 h-8 text-green-400" />
            <div>
              <span className="text-xl font-bold">Place Manager</span>
              {user && (
                <div className="text-xs text-gray-400">
                  {user.name} - Plano: {user.plan.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}