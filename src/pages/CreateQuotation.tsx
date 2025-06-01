import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Calculator, FileText, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateQuotation() {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<QuotationItem>({
    description: '',
    quantity: 0,
    unitPrice: 0
  });

  const handleAddItem = () => {
    if (currentItem.description && currentItem.quantity > 0 && currentItem.unitPrice > 0) {
      setItems([...items, currentItem]);
      setCurrentItem({
        description: '',
        quantity: 0,
        unitPrice: 0
      });
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateItemDetails = (item: QuotationItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Quotation</h1>

      <Card className="mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Item Description"
              className="p-2 border rounded"
              value={currentItem.description}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="p-2 border rounded"
              value={currentItem.quantity || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Unit Price"
              className="p-2 border rounded"
              value={currentItem.unitPrice || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: Number(e.target.value) })}
            />
          </div>
          <Button onClick={handleAddItem} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.description}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => setShowCalculationModal(true)}>
          <Calculator className="w-4 h-4 mr-2" />
          Calculate
        </Button>
        <Button onClick={() => setShowPreviewModal(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <Modal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        title="Calculation Details"
      >
        <div className="space-y-4">
          {items.map((item, index) => {
            const details = calculateItemDetails(item);
            return (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold">{item.description}</h3>
                <div className="text-sm space-y-1">
                  <p>Subtotal: {formatCurrency(details.subtotal)}</p>
                  <p>Tax (10%): {formatCurrency(details.tax)}</p>
                  <p className="font-semibold">Total: {formatCurrency(details.total)}</p>
                </div>
              </div>
            );
          })}
          <div className="pt-4 font-bold">
            Grand Total: {formatCurrency(calculateTotal())}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Quotation Preview"
      >
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold mb-2">Quotation</h2>
            <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-bold">Total Amount:</p>
              <p className="font-bold">{formatCurrency(calculateTotal())}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}