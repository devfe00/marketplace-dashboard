import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getProducts, createProduct, deleteProduct, createSale } from '../services/api';
import ExportButton from '../components/ExportButton';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: '',
  });
  const [saleQuantity, setSaleQuantity] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setShowModal(false);
      setFormData({ name: '', sku: '', price: '', stock: '', category: '', description: '' });
      loadProducts();
      alert('Produto criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar produto: ' + error.response?.data?.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(id);
        loadProducts();
        alert('Produto deletado com sucesso!');
      } catch (error) {
        alert('Erro ao deletar produto');
      }
    }
  };

  const handleSale = async (e) => {
    e.preventDefault();
    try {
      await createSale({
        productId: selectedProduct._id,
        quantity: parseInt(saleQuantity),
      });
      setShowSaleModal(false);
      setSelectedProduct(null);
      setSaleQuantity(1);
      loadProducts();
      alert('Venda registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar venda: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
  <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>

  <div className="flex space-x-3">
    <ExportButton 
      data={products} 
      filename="produtos" 
      type="products" 
    />

    <button
      onClick={() => setShowModal(true)}
      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
    >
      <Plus className="w-5 h-5" />
      <span>Novo Produto</span>
    </button>
  </div>
</div>


      {/*tabela de produtos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Nome</th>
              <th className="text-left py-3 px-4">SKU</th>
              <th className="text-left py-3 px-4">Categoria</th>
              <th className="text-right py-3 px-4">Preço</th>
              <th className="text-right py-3 px-4">Estoque</th>
              <th className="text-center py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{product.name}</td>
                <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4 text-right text-green-600 font-semibold">
                  R$ {product.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${product.stock <= 10 ? 'text-red-600' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowSaleModal(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Vender
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Produto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Novo Produto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="SKU"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Estoque"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Categoria"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <textarea
                placeholder="Descrição"
                className="w-full border rounded-lg px-4 py-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Venda */}
      {showSaleModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Registrar Venda</h2>
            <div className="mb-4">
              <p className="text-gray-600">Produto: <span className="font-semibold">{selectedProduct.name}</span></p>
              <p className="text-gray-600">Estoque: <span className="font-semibold">{selectedProduct.stock}</span></p>
              <p className="text-gray-600">Preço: <span className="font-semibold text-green-600">R$ {selectedProduct.price.toFixed(2)}</span></p>
            </div>
            <form onSubmit={handleSale} className="space-y-4">
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                placeholder="Quantidade"
                className="w-full border rounded-lg px-4 py-2"
                value={saleQuantity}
                onChange={(e) => setSaleQuantity(e.target.value)}
                required
              />
              <p className="text-lg font-semibold">
                Total: R$ {(selectedProduct.price * saleQuantity).toFixed(2)}
              </p>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirmar Venda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaleModal(false);
                    setSelectedProduct(null);
                    setSaleQuantity(1);
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}