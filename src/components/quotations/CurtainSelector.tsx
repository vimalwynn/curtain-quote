import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { Package } from 'lucide-react';

interface CurtainSelectorProps {
  label: 'Primary' | 'Secondary';
  selectedId: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
  }>;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function CurtainSelector({
  label,
  selectedId,
  products,
  onChange,
  disabled = false
}: CurtainSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {label} Curtain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <select
            value={selectedId}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a curtain</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {formatCurrency(product.price)}
              </option>
            ))}
          </select>

          {selectedId && (
            <div className="mt-4">
              {products.map(product => {
                if (product.id === selectedId) {
                  return (
                    <div key={product.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{product.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                        <span className={`font-medium ${
                          product.stock > 20 
                            ? 'text-green-600 dark:text-green-400'
                            : product.stock > 10
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {product.stock} units available
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}