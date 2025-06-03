import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Save, FileText, Plus, AlertCircle, Calculator } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

// Constants
const MOTORIZATION_OPTIONS = {
  manual: { label: 'Manual', price: 0 },
  normal: { label: 'Normal Motor', price: 20 },
  tuya: { label: 'Tuya Smart Motor', price: 40 },
  dooya: { label: 'Dooya Motor', price: 60 },
} as const;

const LINING_OPTIONS = {
  none: { label: 'None', price: 0 },
  standard: { label: 'Standard', price: 5 },
  blackout: { label: 'Blackout', price: 8 },
} as const;

// Mock fabric data - replace with actual data from your database
const FABRICS = [
  { id: '1', name: 'Premium Silk', code: 'PS001', price: 15.99, image: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '2', name: 'Linen Blend', code: 'LB002', price: 12.99, image: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '3', name: 'Velvet', code: 'VL003', price: 18.99, image: 'https://images.pexels.com/photos/1699970/pexels-photo-1699970.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

interface WindowTreatment {
  identifier: string;
  width: number;
  height: number;
  primaryRail: {
    type: 'none' | 'wave' | 'easyMovable' | string;
    style: string;
  };
  secondaryRail: {
    type: 'none' | 'wave' | 'easyMovable' | string;
    style: string;
  };
  primaryFabric: string;
  secondaryFabric: string;
  lining: keyof typeof LINING_OPTIONS;
  motorization: keyof typeof MOTORIZATION_OPTIONS;
  quantity: number;
  specialInstructions: string;
}

interface CustomerDetails {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
}

export default function CreateQuotation() {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const [treatment, setTreatment] = useState<WindowTreatment>({
    identifier: '',
    width: 0,
    height: 0,
    primaryRail: { type: 'none', style: '' },
    secondaryRail: { type: 'none', style: '' },
    primaryFabric: '',
    secondaryFabric: '',
    lining: 'none',
    motorization: 'manual',
    quantity: 1,
    specialInstructions: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [customRailOption, setCustomRailOption] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCustomRailAdd = () => {
    if (customRailOption.trim()) {
      // Add custom rail option logic here
      setCustomRailOption('');
    }
  };

  const calculateCosts = () => {
    const primaryFabric = FABRICS.find(f => f.id === treatment.primaryFabric);
    const secondaryFabric = FABRICS.find(f => f.id === treatment.secondaryFabric);
    
    const fabricCost = ((primaryFabric?.price || 0) + (secondaryFabric?.price || 0)) * 
      (treatment.width / 100) * (treatment.height / 100);
    
    const liningCost = LINING_OPTIONS[treatment.lining].price * 
      (treatment.width / 100) * (treatment.height / 100);
    
    const motorizationCost = MOTORIZATION_OPTIONS[treatment.motorization].price;
    
    const installationCost = 25; // Base installation cost
    
    const subtotal = (fabricCost + liningCost + motorizationCost + installationCost) * treatment.quantity;
    const vat = subtotal * 0.10;
    const total = subtotal + vat;

    return {
      fabricCost,
      liningCost,
      motorizationCost,
      installationCost,
      subtotal,
      vat,
      total
    };
  };

  const handleRailTypeChange = (rail: 'primary' | 'secondary', type: string) => {
    const style = type === 'wave' ? 'Wave Curtain' : 
                 type === 'easyMovable' ? 'Pencil Pleat' : '';
    
    setTreatment(prev => ({
      ...prev,
      [rail === 'primary' ? 'primaryRail' : 'secondaryRail']: {
        type,
        style
      }
    }));
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 1000);
  };

  const handleSave = () => {
    // Save logic here
  };

  const handlePreview = () => {
    // Preview logic here
  };

  const costs = calculateCosts();

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Window Treatment Quote</h1>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerDetails.fullName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={customerDetails.contactNumber}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, contactNumber: e.target.value }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="+973"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Installation Address *
                </label>
                <textarea
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Window Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Window Identifier *
                </label>
                <input
                  type="text"
                  value={treatment.identifier}
                  onChange={(e) => setTreatment(prev => ({ ...prev, identifier: e.target.value }))}
                  placeholder="e.g., Master Bedroom - North Wall"
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width (cm) *
                  </label>
                  <input
                    type="number"
                    value={treatment.width || ''}
                    onChange={(e) => setTreatment(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    value={treatment.height || ''}
                    onChange={(e) => setTreatment(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rail Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Primary Rail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rail Type *
                    </label>
                    <select
                      value={treatment.primaryRail.type}
                      onChange={(e) => handleRailTypeChange('primary', e.target.value)}
                      className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="none">None</option>
                      <option value="wave">Wave Track</option>
                      <option value="easyMovable">Easy Movable Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Curtain Style
                    </label>
                    <input
                      type="text"
                      value={treatment.primaryRail.style}
                      className="w-full h-12 text-lg rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Style is automatically set based on rail type
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Secondary Rail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rail Type
                    </label>
                    <select
                      value={treatment.secondaryRail.type}
                      onChange={(e) => handleRailTypeChange('secondary', e.target.value)}
                      className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="none">None</option>
                      <option value="wave">Wave Track</option>
                      <option value="easyMovable">Easy Movable Track</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Curtain Style
                    </label>
                    <input
                      type="text"
                      value={treatment.secondaryRail.style}
                      className="w-full h-12 text-lg rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Style is automatically set based on rail type
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Add Custom Rail Option
                  </label>
                  <input
                    type="text"
                    value={customRailOption}
                    onChange={(e) => setCustomRailOption(e.target.value)}
                    placeholder="Enter custom rail type"
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <Button onClick={handleCustomRailAdd} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Option
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fabric Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Curtain *
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {FABRICS.map(fabric => (
                    <label
                      key={fabric.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        treatment.primaryFabric === fabric.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="primaryFabric"
                        value={fabric.id}
                        checked={treatment.primaryFabric === fabric.id}
                        onChange={(e) => setTreatment(prev => ({ ...prev, primaryFabric: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={fabric.image}
                          alt={fabric.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{fabric.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Code: {fabric.code}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(fabric.price)}/meter
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Curtain
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {FABRICS.map(fabric => (
                    <label
                      key={fabric.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        treatment.secondaryFabric === fabric.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="secondaryFabric"
                        value={fabric.id}
                        checked={treatment.secondaryFabric === fabric.id}
                        onChange={(e) => setTreatment(prev => ({ ...prev, secondaryFabric: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={fabric.image}
                          alt={fabric.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{fabric.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Code: {fabric.code}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(fabric.price)}/meter
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lining Selection *
                </label>
                <select
                  value={treatment.lining}
                  onChange={(e) => setTreatment(prev => ({ ...prev, lining: e.target.value as keyof typeof LINING_OPTIONS }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                >
                  {Object.entries(LINING_OPTIONS).map(([key, { label, price }]) => (
                    <option key={key} value={key}>
                      {label} {price > 0 && `(+${formatCurrency(price)}/m²)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motorization
                </label>
                <select
                  value={treatment.motorization}
                  onChange={(e) => setTreatment(prev => ({ ...prev, motorization: e.target.value as keyof typeof MOTORIZATION_OPTIONS }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  {Object.entries(MOTORIZATION_OPTIONS).map(([key, { label, price }]) => (
                    <option key={key} value={key}>
                      {label} {price > 0 && `(+${formatCurrency(price)})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={treatment.quantity}
                  onChange={(e) => setTreatment(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={treatment.specialInstructions}
                  onChange={(e) => setTreatment(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Any additional requirements or notes"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 font-medium text-gray-900 dark:text-white">
                  Materials:
                </div>
                <div>Fabric Cost:</div>
                <div className="text-right">{formatCurrency(costs.fabricCost)}</div>
                <div>Lining Cost:</div>
                <div className="text-right">{formatCurrency(costs.liningCost)}</div>
                <div>Motorization:</div>
                <div className="text-right">{formatCurrency(costs.motorizationCost)}</div>
                <div>Installation:</div>
                <div className="text-right">{formatCurrency(costs.installationCost)}</div>
                
                <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(costs.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (10%):</span>
                    <span>{formatCurrency(costs.vat)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(costs.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(costs.total)}</span>
            </div>
            <Button
              variant="outline"
              leftIcon={<Calculator className="h-4 w-4" />}
              onClick={handleCalculate}
              isLoading={isCalculating}
            >
              Calculate
            </Button>
          </div>
          <div className="flex space-x-4">
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
              onClick={handleSave}
            >
              Save Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuotation