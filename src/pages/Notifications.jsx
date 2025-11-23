import { useEffect, useState } from 'react';
import { RefreshCw, CheckCheck } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import {
  getNotifications,
  generateNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      const params = {};
      if (filter === 'unread') params.read = false;
      if (filter !== 'all' && filter !== 'unread') params.type = filter;

      const response = await getNotifications(params);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateNotifications();
      loadNotifications();
      alert('Notificações geradas com sucesso!');
    } catch (error) {
      alert('Erro ao gerar notificações');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      loadNotifications();
    } catch (error) {
      alert('Erro ao marcar como lida');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      loadNotifications();
      alert('Todas as notificações foram marcadas como lidas!');
    } catch (error) {
      alert('Erro ao marcar todas como lidas');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta notificação?')) {
      try {
        await deleteNotification(id);
        loadNotifications();
      } catch (error) {
        alert('Erro ao deletar notificação');
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notificações</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleMarkAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-5 h-5" />
            <span>Marcar todas como lidas</span>
          </button>
          <button
            onClick={handleGenerate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Gerar Notificações</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'unread', label: 'Não lidas' },
            { value: 'low_stock', label: 'Estoque Baixo' },
            { value: 'hot_product', label: 'Produtos Hot' },
            { value: 'restock_suggestion', label: 'Sugestões' },
            { value: 'no_sales', label: 'Sem Vendas' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                filter === f.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Carregando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Nenhuma notificação encontrada
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationBell
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}