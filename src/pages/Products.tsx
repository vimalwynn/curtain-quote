import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, fabricOptions } from '../data/mockData';
import DataTable from '../components/ui/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Package, Plus, Filter, Search, Edit, Trash2, FileText, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  requiresSecondaryFabric: boolean;
  compatibleFabrics: {
    primary: string[];
    secondary: string[];
  };
}

interface QuotationUsage {
  id: string;
  quotationNumber: string;
  customerName: string;
  date: string;
  quantity: number;
  status: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [productList, setProductList] = useState<Product[]>(products);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Mock quotation usage data
  const mockQuotationUsage: Record<string, QuotationUsage[]> = {
    '1': [
      {
        id: '1',
        quotationNumber: 'QT-2024-001',
        customerName: 'Ahmed Hassan',
        date: '2024-03-15',
        quantity: 25,
        status: 'Accepted'
      },
      {
        id: '2',
        quotationNumber: 'QT-2024-002',
        customerName: 'Sara Ali',
        date: '2024-03-10',
        quantity: 15,
        status: 'Pending'
      }
    ]
  };

  const filteredProducts = productList.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCompatibleFabrics = (product: Product) => {
    const primaryFabrics = product.compatibleFabrics.primary
      .map(id => fabricOptions.find(f => f.id === id))
      .filter(f => f !== undefined);
    
    const secondaryFabrics = product.compatibleFabrics.secondary
      .map(id => fabricOptions.find(f => f.id === id))
      .filter(f => f !== undefined);

    return { primaryFabrics, secondaryFabrics };
  };

  const handleCreateQuote = (product: Product) => {
    navigate(`/quotations/create?productId=${product.id}`);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductList(productList.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingProduct) return;
    setProductList(productList.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setShowEditModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredProducts.map(product => {
          const { primaryFabrics, secondaryFabrics } = getCompatibleFabrics(product);
          const quotationHistory = mockQuotationUsage[product.id] || [];

          return (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<FileText className="h-4 w-4" />}
                      onClick={() => handleCreateQuote(product)}
                    >
                      Create Quote
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit className="h-4 w-4" />}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="py-4 grid grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Stock</h3>
                    <p className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${
                      product.stock > 20
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : product.stock > 10
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock} units
                    </p>
                  </div>
                </div>

                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Compatible Fabrics</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Primary Fabrics</h4>
                      <div className="flex flex-wrap gap-2">
                        {primaryFabrics.map(fabric => (
                          <div
                            key={fabric.id}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                          >
                            <img
                              src={fabric.image}
                              alt={fabric.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{fabric.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{fabric.code}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {product.requiresSecondaryFabric && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Secondary Fabrics</h4>
                        <div className="flex flex-wrap gap-2">
                          {secondaryFabrics.map(fabric => (
                            <div
                              key={fabric.id}
                              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                            >
                              <img
                                src={fabric.image}
                                alt={fabric.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{fabric.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{fabric.code}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="py-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Quotations</h3>
                  {quotationHistory.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {quotationHistory.map(quote => (
                        <div key={quote.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {quote.quotationNumber}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {quote.customerName} • {formatDate(quote.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Quantity: {quote.quantity}
                            </p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              quote.status === 'Accepted'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {quote.status}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No quotations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
      >
        {editingProduct && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.001"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}