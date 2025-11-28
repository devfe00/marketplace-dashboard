import { useEffect, useState } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { getDashboard, getBestSellers } from '../services/api';
import ExportButton from '../components/ExportButton';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashRes, sellersRes] = await Promise.all([
        getDashboard(),
        getBestSellers(),
      ]);
      setDashboard(dashRes.data.data);
      setBestSellers(sellersRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total de Vendas"
          value={dashboard?.sales?.totalSales || 0}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Faturamento"
          value={`R$ ${dashboard?.sales?.totalValue?.toFixed(2) || 0}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <DashboardCard
          title="Produtos Vendidos"
          value={dashboard?.sales?.totalQuantity || 0}
          icon={Package}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Estoque Baixo"
          value={dashboard?.lowStock?.count || 0}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">🔥 Produtos Mais Vendidos</h2>

    <ExportButton 
      data={bestSellers} 
      filename="produtos_mais_vendidos" 
      type="products" 
    />
  </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Produto</th>
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Categoria</th>
                <th className="text-right py-3 px-4">Quantidade Vendida</th>
                <th className="text-right py-3 px-4">Faturamento</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.productName}</td>
                  <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {product.totalQuantity}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 font-semibold">
                    R$ {product.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dashboard?.lowStock?.products?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-orange-600">
            ⚠️ Produtos com Estoque Baixo
          </h2>
          <div className="space-y-2">
            {dashboard.lowStock.products.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-center p-3 bg-orange-50 rounded"
              >
                <div>
                  <span className="font-semibold">{product.name}</span>
                  <span className="text-gray-600 ml-2">({product.sku})</span>
                </div>
                <span className="text-orange-600 font-bold">
                  {product.stock} unidades
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}