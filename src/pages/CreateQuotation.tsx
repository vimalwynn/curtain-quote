import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Save, FileText, Plus, AlertCircle, Download, Printer, Calculator } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import QuotationPreview from '../components/quotations/QuotationPreview';
import { generatePDF, printDocument } from '../utils/print';
import CurtainCalculator from '../components/quotations/CurtainCalculator';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuotationDetails {
  number: string;
  date: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  customer: {
    name: string;
    company?: string;
    address: string;
    phone: string;
    email: string;
  };
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string[];
}

export default function CreateQuotation() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [quotation, setQuotation] = useState<QuotationDetails>({
    number: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Draft',
    customer: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [error, setError] = useState<string | null>(null);

  const handlePreview = () => {
    if (!quotation.customer.name) {
      setError('Please enter customer details before previewing');
      return;
    }
    if (quotation.items.length === 0) {
      setError('Please add at least one item before previewing');
      return;
    }
    setShowPreviewModal(true);
  };

  const handlePrint = async () => {
    try {
      await printDocument('quotationPreview');
    } catch (err) {
      setError('Failed to print. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('quotationPreview');
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handleCalculatorResult = (result: any) => {
    // Add calculated item to quotation
    const newItem: QuotationItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: `Curtain - ${result.style} (${result.width}cm × ${result.height}cm)`,
      quantity: result.quantity,
      unitPrice: result.unitPrice,
      total: result.total,
    };

    setQuotation(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      subtotal: prev.subtotal + result.total,
      tax: (prev.subtotal + result.total) * 0.1,
      total: (prev.subtotal + result.total) * 1.1,
    }));

    setShowCalculatorModal(false);
  };

  return (
    <div className="pb-24"> {/* Add padding to account for fixed footer */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Quotation</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={quotation.customer.name}
                  onChange={(e) => setQuotation(prev => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value }
                  }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={quotation.customer.email}
                  onChange={(e) => setQuotation(prev => ({
                    ...prev,
                    customer: { ...prev.customer, email: e.target.value }
                  }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={quotation.customer.phone}
                  onChange={(e) => setQuotation(prev => ({
                    ...prev,
                    customer: { ...prev.customer, phone: e.target.value }
                  }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={quotation.customer.address}
                  onChange={(e) => setQuotation(prev => ({
                    ...prev,
                    customer: { ...prev.customer, address: e.target.value }
                  }))}
                  className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotation.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.total)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.unitPrice)} each</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button
                  onClick={() => setShowCalculatorModal(true)}
                  leftIcon={<Calculator className="h-4 w-4" />}
                >
                  Add Item
                </Button>
              </div>

              {quotation.items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4">
                    <span>Total</span>
                    <span>{formatCurrency(quotation.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Quotation Preview"
      >
        <div className="space-y-6">
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handlePrint}
              leftIcon={<Printer className="h-4 w-4" />}
            >
              Print
            </Button>
            <Button
              onClick={handleDownloadPDF}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Download PDF
            </Button>
          </div>

          <div id="quotationPreview">
            <QuotationPreview quotation={quotation} />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
        title="Curtain Calculator"
      >
        <CurtainCalculator onCalculate={handleCalculatorResult} />
      </Modal>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={handlePreview}
            >
              Preview Quote
            </Button>
            <Button
              variant="modern"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => {/* TODO: Implement save functionality */}}
            >
              Save Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}