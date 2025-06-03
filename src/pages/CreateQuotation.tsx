import { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Calculator, FileText, Plus, Ruler, Save, Download, Printer, AlertCircle, User } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import CurtainCalculator from '../components/quotations/CurtainCalculator';
import QuotationPreview from '../components/quotations/QuotationPreview';
import { generatePDF, printDocument } from '../utils/print';
import { saveQuotation } from '../utils/supabase';

interface QuotationItem {
  roomName: string;
  measurements: {
    width: number;
    height: number;
    fullness: number;
    style: 'wave' | 'pencilPleat';
    railType: string;
    lining: 'none' | 'standard' | 'blackout' | 'thermal';
  };
  frontLayer: {
    name: string;
    pricePerMeter: number;
  };
  secondLayer: {
    name: string;
    pricePerMeter: number;
  } | null;
  quantity: number;
  totalFabric: number;
  laborCost: number;
  accessories: {
    tracks: number;
  };
}

export default function CreateQuotation() {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quotationRef = useRef<HTMLDivElement>(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleCalculatorResult = (result: any) => {
    // Handle calculator results
    console.log('Calculator results:', result);
  };

  const handlePrint = () => {
    if (quotationRef.current) {
      printDocument('quotationPreview');
    }
  };

  const handleDownloadPDF = async () => {
    if (quotationRef.current) {
      await generatePDF('quotationPreview');
    }
  };

  const handleSaveQuotation = async () => {
    if (items.length === 0) {
      setError('Add at least one item to save the quotation');
      return;
    }

    if (!customerDetails.name) {
      setError('Customer name is required');
      return;
    }

    try {
      const quotationData = {
        number: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: new Date().toISOString(),
        customer_name: customerDetails.name,
        customer_email: customerDetails.email || null,
        customer_phone: customerDetails.phone || null,
        customer_address: customerDetails.address || null,
        items,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: 'Draft' as const,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: null
      };

      await saveQuotation(quotationData);
      setError(null);
      // Show success message or redirect
    } catch (err) {
      setError('Failed to save quotation');
      console.error('Error saving quotation:', err);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal = calculateItemTotal(item);
      return sum + (itemTotal * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateItemTotal = (item: QuotationItem) => {
    const fabricCost = item.totalFabric * item.frontLayer.pricePerMeter;
    const secondLayerCost = item.secondLayer ? item.totalFabric * item.secondLayer.pricePerMeter : 0;
    const trackCost = item.accessories.tracks * 25; // Assuming 25 per meter of track
    return fabricCost + secondLayerCost + item.laborCost + trackCost;
  };

  return (
    <div className="pb-24">
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
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-6 w-6" />
                Customer Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <Ruler className="h-6 w-6" />
                Curtain Details
              </h3>
              
              <CurtainCalculator onCalculate={handleCalculatorResult} />
            </div>
          </div>
        </Card>

        {items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Added Items</h3>
            {items.map((item, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.roomName}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.measurements.width}m × {item.measurements.height}m
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.frontLayer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateItemTotal(item) * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        title="Calculation Details"
      >
        <div className="space-y-4">
          {/* Calculation details content */}
        </div>
      </Modal>

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

          <div ref={quotationRef} id="quotationPreview">
            <QuotationPreview
              quotation={{
                number: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                date: new Date().toISOString(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Draft',
                customer: {
                  name: customerDetails.name || 'Customer Name',
                  email: customerDetails.email || '',
                  phone: customerDetails.phone || '',
                  address: customerDetails.address || ''
                },
                items: items.map(item => ({
                  id: Math.random().toString(),
                  description: `${item.roomName} - ${item.measurements.width}m × ${item.measurements.height}m ${item.measurements.style}`,
                  quantity: item.quantity,
                  unitPrice: calculateItemTotal(item),
                  total: calculateItemTotal(item) * item.quantity
                })),
                subtotal: calculateSubtotal(),
                tax: calculateTax(),
                total: calculateTotal()
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => setShowCalculationModal(true)}
              leftIcon={<Calculator className="h-4 w-4" />}
              variant="outline"
            >
              View Calculations
            </Button>
            <Button
              onClick={() => setShowPreviewModal(true)}
              leftIcon={<FileText className="h-4 w-4" />}
              variant="outline"
            >
              Preview Quote
            </Button>
            <Button
              onClick={handleSaveQuotation}
              leftIcon={<Save className="h-4 w-4" />}
              variant="modern"
            >
              Save Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}