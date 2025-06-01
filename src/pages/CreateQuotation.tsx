import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Trash2, Save, ArrowLeft, Calculator, Percent } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../utils/cn';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxRate: number;
  discount: number;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  vatNumber: string;
}

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    vatNumber: ''
  });

  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, taxRate: 10, discount: 0 }
  ]);

  const [validUntil, setValidUntil] = useState('');
  const [quoteNumber] = useState(`QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(
    'Payment is due within 30 days from the date of invoice. Late payments are subject to a 5% monthly finance charge.'
  );
  
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: '',
        quantity: 1,
        price: 0,
        taxRate: 10,
        discount: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemTotal = (item: QuotationItem) => {
    const subtotal = item.quantity * item.price;
    const discountAmount = subtotal * (item.discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (item.taxRate / 100);
    return afterDiscount + taxAmount;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.price;
      const discountAmount = subtotal * (item.discount / 100);
      return sum + (subtotal - discountAmount);
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.price;
      return sum + (subtotal * (item.discount / 100));
    }, 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.price;
      const discountAmount = subtotal * (item.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      return sum + (afterDiscount * (item.taxRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client.name || !client.email || !validUntil) {
      alert('Please fill in all required fields');
      return;
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.price <= 0)) {
      alert('Please fill in all item details correctly');
      return;
    }

    const quotation = {
      quoteNumber,
      client,
      items,
      validUntil,
      paymentTerms,
      notes,
      terms,
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      totalTax: calculateTotalTax(),
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: 'Draft' as const
    };
    
    console.log('Saving quotation:', quotation);
    navigate('/quotations');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/quotations')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Quotation</h1>
        </div>
        <Button 
          leftIcon={<Save className="h-4 w-4" />}
          onClick={handleSubmit}
        >
          Save Quote
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={client.company}
                    onChange={(e) => setClient({ ...client, company: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={client.vatNumber}
                    onChange={(e) => setClient({ ...client, vatNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,80px,100px,90px,90px,90px,40px] gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div>Description</div>
                  <div>Quantity</div>
                  <div>Price</div>
                  <div>Tax Rate</div>
                  <div>Discount</div>
                  <div>Total</div>
                  <div></div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr,80px,100px,90px,90px,90px,40px] gap-4 items-center">
                    <div>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 pr-7 sm:text-sm"
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 pr-7 sm:text-sm"
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-400">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateItemTotal(item))}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={cn(
                        "text-gray-400 hover:text-red-500 dark:hover:text-red-400",
                        items.length === 1 && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={items.length === 1}
                      type="button"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Quote Number</span>
                  <span className="font-medium text-gray-900 dark:text-white">{quoteNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Discount</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(calculateTotalDiscount())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(calculateTotalTax())}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Valid Until <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="immediate">Immediate Payment</option>
                    <option value="15">Net 15</option>
                    <option value="30">Net 30</option>
                    <option value="45">Net 45</option>
                    <option value="60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or instructions..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Terms & Conditions
                  </label>
                  <textarea
                    rows={4}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Calculator className="h-4 w-4" />}
                >
                  Calculate Profit Margin
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Percent className="h-4 w-4" />}
                >
                  Apply Bulk Discount
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}