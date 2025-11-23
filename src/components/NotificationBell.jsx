import { AlertCircle, TrendingUp, Package, Clock } from 'lucide-react';

export default function NotificationBell({ notification, onMarkAsRead, onDelete }) {
  const icons = {
    low_stock: AlertCircle,
    hot_product: TrendingUp,
    restock_suggestion: Package,
    no_sales: Clock,
  };

  const colors = {
    critical: 'bg-red-100 border-red-500',
    high: 'bg-orange-100 border-orange-500',
    medium: 'bg-yellow-100 border-yellow-500',
    low: 'bg-blue-100 border-blue-500',
  };

  const Icon = icons[notification.type] || AlertCircle;

  return (
    <div className={`border-l-4 p-4 rounded-lg mb-3 ${colors[notification.priority]} ${notification.read ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Icon className="w-6 h-6 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(notification.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification._id)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Marcar como lida
            </button>
          )}
          <button
            onClick={() => onDelete(notification._id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}