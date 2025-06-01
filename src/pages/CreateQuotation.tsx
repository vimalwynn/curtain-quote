import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Trash2, Save, ArrowLeft, Calculator } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../utils/cn';

interface QuotationItem {
  id: string;
  slNo: number;
  room: string;
  description: string;
  width: number;
  height: number;
  fabricCode: string;
  chiffon: boolean;
  quantity: number;
  rate: number;
  lining: boolean;
  blackout: boolean;
  track: string;
  trackColor: string;
  style: string;
  fold: string;
  hookType: string;
  tieBack: boolean;
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
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+973 1234 5678',
    company: 'Home Decor LLC',
    address: 'Building 123, Road 1234\nManama, Bahrain',
    vatNumber: 'VAT123456789'
  });

  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: '1',
      slNo: 1,
      room: 'Living Room',
      description: 'Main Window',
      width: 250,
      height: 180,
      fabricCode: 'FAB-001',
      chiffon: true,
      quantity: 2,
      rate: 15.500,
      lining: true,
      blackout: false,
      track: 'Double Track',
      trackColor: 'White',
      style: 'Pinch Pleat',
      fold: '2.5',
      hookType: 'Standard',
      tieBack: true
    }
  ]);

  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  
  const [quoteNumber] = useState(`QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [notes, setNotes] = useState('Please note that final measurements will be confirmed during site visit.');
  const [terms, setTerms] = useState(
    '1. 50% advance payment required to confirm the order.\n2. Delivery time: 2-3 weeks after confirmation.\n3. Installation included in the quoted price.\n4. Warranty: 1 year on installation and hardware.'
  );
  
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        slNo: items.length + 1,
        room: '',
        description: '',
        width: 0,
        height: 0,
        fabricCode: '',
        chiffon: false,
        quantity: 1,
        rate: 0,
        lining: false,
        blackout: false,
        track: 'Single Track',
        trackColor: 'White',
        style: 'Pencil Pleat',
        fold: '2.0',
        hookType: 'Standard',
        tieBack: false
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const updatedItems = items.filter(item => item.id !== id)
        .map((item, index) => ({ ...item, slNo: index + 1 }));
      setItems(updatedItems);
    }
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemTotal = (item: QuotationItem) => {
    const baseAmount = item.quantity * item.rate;
    const area = (item.width * item.height) / 10000; // Convert to square meters
    return baseAmount * area;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client.name || !client.email || !validUntil) {
      alert('Please fill in all required fields');
      return;
    }

    if (items.some(item => !item.room || !item.description || item.width <= 0 || item.height <= 0)) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Curtain Quotation</h1>
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
              <div className="grid grid-cols-2 gap-4">
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Address
                  </label>
                  <textarea
                    rows={2}
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
              <CardTitle>Curtain Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Item #{item.slNo}
                      </h4>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Room
                        </label>
                        <input
                          type="text"
                          value={item.room}
                          onChange={(e) => updateItem(item.id, 'room', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Fabric Code
                        </label>
                        <input
                          type="text"
                          value={item.fabricCode}
                          onChange={(e) => updateItem(item.id, 'fabricCode', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          value={item.width || ''}
                          onChange={(e) => updateItem(item.id, 'width', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={item.height || ''}
                          onChange={(e) => updateItem(item.id, 'height', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Track Type
                        </label>
                        <select
                          value={item.track}
                          onChange={(e) => updateItem(item.id, 'track', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Single Track">Single Track</option>
                          <option value="Double Track">Double Track</option>
                          <option value="Triple Track">Triple Track</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Track Color
                        </label>
                        <select
                          value={item.trackColor}
                          onChange={(e) => updateItem(item.id, 'trackColor', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="White">White</option>
                          <option value="Silver">Silver</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Black">Black</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Style
                        </label>
                        <select
                          value={item.style}
                          onChange={(e) => updateItem(item.id, 'style', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Pencil Pleat">Pencil Pleat</option>
                          <option value="Pinch Pleat">Pinch Pleat</option>
                          <option value="Wave">Wave</option>
                          <option value="Eyelet">Eyelet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Fold
                        </label>
                        <select
                          value={item.fold}
                          onChange={(e) => updateItem(item.id, 'fold', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="2.0">2.0</option>
                          <option value="2.5">2.5</option>
                          <option value="3.0">3.0</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Hook Type
                        </label>
                        <select
                          value={item.hookType}
                          onChange={(e) => updateItem(item.id, 'hookType', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Decorative">Decorative</option>
                          <option value="Metal">Metal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rate
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`chiffon-${item.id}`}
                          checked={item.chiffon}
                          onChange={(e) => updateItem(item.id, 'chiffon', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`chiffon-${item.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Chiffon
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`lining-${item.id}`}
                          checked={item.lining}
                          onChange={(e) => updateItem(item.id, 'lining', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`lining-${item.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Lining
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`blackout-${item.id}`}
                          checked={item.blackout}
                          onChange={(e) => updateItem(item.id, 'blackout', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`blackout-${item.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Blackout
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tieBack-${item.id}`}
                          checked={item.tieBack}
                          onChange={(e) => updateItem(item.id, 'tieBack', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`tieBack-${item.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Tie Back
                        </label>
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Area: {((item.width * item.height) / 10000).toFixed(2)} m²
                      </p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Amount: {formatCurrency(calculateItemTotal(item))}
                      </p>
                    </div>
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
                  Calculate Area
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}