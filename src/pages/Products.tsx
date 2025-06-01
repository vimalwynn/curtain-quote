import { useState } from 'react';
import { products } from '../data/mockData';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import { Package, Plus, Filter, Search, Star, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 text-amber-400" />
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      );
    }
    
    return (
      <div className="flex">
        {stars}
        <span className="ml-1 text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Product', 
      sortable: true,
      render: (product: typeof products[0]) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
            <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">{product.category}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'price', 
      header: 'Price', 
      sortable: true,
      render: (product: typeof products[0]) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(product.price)}
        </span>
      )
    },
    { 
      key: 'stock', 
      header: 'Stock', 
      sortable: true,
      render: (product: typeof products[0]) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          product.stock > 20
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : product.stock > 10
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {product.stock} units
        </span>
      )
    },
    { 
      key: 'rating', 
      header: 'Rating', 
      sortable: true,
      render: (product: typeof products[0]) => renderStars(product.rating)
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (product: typeof products[0]) => (
        <div className="flex space-x-2">
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="audio">Audio</option>
              <option value="wearables">Wearables</option>
              <option value="accessories">Accessories</option>
              <option value="storage">Storage</option>
            </select>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyExtractor={(product) => product.id}
          zebra={true}
        />
      </div>
    </div>
  );
}