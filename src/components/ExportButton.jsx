import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ExportButton({ data, filename, type = 'products' }) {
  const handleExport = () => {
    let exportData = [];

    if (type === 'products') {
      exportData = data.map(product => ({
        'Nome': product.name,
        'SKU': product.sku,
        'Categoria': product.category,
        'Preço': `R$ ${product.price.toFixed(2)}`,
        'Estoque': product.stock,
        'Status': product.status === 'active' ? 'Ativo' : 'Inativo',
      }));
    } else if (type === 'sales') {
      exportData = data.map(sale => ({
        'Produto': sale.productId?.name || 'N/A',
        'Quantidade': sale.quantity,
        'Valor Total': `R$ ${sale.totalValue.toFixed(2)}`,
        'Data': new Date(sale.saleDate).toLocaleDateString('pt-BR'),
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
    >
      <Download className="w-5 h-5" />
      <span>Exportar Excel</span>
    </button>
  );
}