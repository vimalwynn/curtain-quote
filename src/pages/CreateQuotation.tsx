import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Save, FileText, Plus, AlertCircle, Calculator } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface CurtainOption {
  id: string;
  name: string;
  code: string;
  price: number;
  image: string;
  type: 'regular' | 'premium' | 'luxury';
  minQuantity: number;
  bulkDiscount?: {
    quantity: number;
    percentage: number;
  }[];
  availableStock: number;
  processingOptions: {
    id: string;
    name: string;
    price: number;
  }[];
  compatibleWith?: string[];
}

const initialCurtainOptions: CurtainOption[] = [
  {
    id: '1',
    name: 'Premium Silk',
    code: 'PS001',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'premium',
    minQuantity: 2,
    bulkDiscount: [
      { quantity: 5, percentage: 5 },
      { quantity: 10, percentage: 10 }
    ],
    availableStock: 150,
    processingOptions: [
      { id: 'p1', name: 'Standard Finish', price: 0 },
      { id: 'p2', name: 'Anti-Wrinkle Treatment', price: 2.50 },
      { id: 'p3', name: 'Stain Protection', price: 3.99 }
    ],
    compatibleWith: ['2', '3']
  },
  {
    id: '2',
    name: 'Linen Blend',
    code: 'LB002',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'regular',
    minQuantity: 1,
    bulkDiscount: [
      { quantity: 8, percentage: 8 },
      { quantity: 15, percentage: 15 }
    ],
    availableStock: 200,
    processingOptions: [
      { id: 'p1', name: 'Standard Finish', price: 0 },
      { id: 'p4', name: 'UV Protection', price: 2.99 }
    ],
    compatibleWith: ['1', '3']
  },
  {
    id: '3',
    name: 'Velvet',
    code: 'VL003',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1699970/pexels-photo-1699970.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'luxury',
    minQuantity: 2,
    bulkDiscount: [
      { quantity: 4, percentage: 7 },
      { quantity: 8, percentage: 12 }
    ],
    availableStock: 100,
    processingOptions: [
      { id: 'p1', name: 'Standard Finish', price: 0 },
      { id: 'p5', name: 'Flame Retardant', price: 4.99 },
      { id: 'p6', name: 'Water Repellent', price: 3.50 }
    ],
    compatibleWith: ['1', '2']
  }
];

interface ProcessingSelection {
  primaryProcessing: string[];
  secondaryProcessing: string[];
}

interface CustomerDetails {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
}

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
  primaryProcessing: string[];
  secondaryProcessing: string[];
  lining: keyof typeof LINING_OPTIONS;
  motorization: keyof typeof MOTORIZATION_OPTIONS;
  quantity: number;
  specialInstructions: string;
}

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

interface NewCurtainForm {
  name: string;
  code: string;
  price: number;
  image: string;
  type: 'regular' | 'premium' | 'luxury';
  minQuantity: number;
  availableStock: number;
  processingOptions: {
    id: string;
    name: string;
    price: number;
  }[];
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
    primaryProcessing: [],
    secondaryProcessing: [],
    lining: 'none',
    motorization: 'manual',
    quantity: 1,
    specialInstructions: '',
  });

  const [curtainOptions, setCurtainOptions] = useState<CurtainOption[]>(initialCurtainOptions);
  const [showNewCurtainModal, setShowNewCurtainModal] = useState(false);
  const [newCurtainType, setNewCurtainType] = useState<'primary' | 'secondary'>('primary');
  const [newCurtainForm, setNewCurtainForm] = useState<NewCurtainForm>({
    name: '',
    code: '',
    price: 0,
    image: '',
    type: 'regular',
    minQuantity: 1,
    availableStock: 0,
    processingOptions: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [customRailOption, setCustomRailOption] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCustomRailAdd = () => {
    if (customRailOption.trim()) {
      setCustomRailOption('');
    }
  };

  const calculateBulkDiscount = (price: number, quantity: number, discounts?: { quantity: number; percentage: number }[]) => {
    if (!discounts || discounts.length === 0) return price;
    
    const applicableDiscount = [...discounts]
      .sort((a, b) => b.quantity - a.quantity)
      .find(d => quantity >= d.quantity);
    
    if (!applicableDiscount) return price;
    
    return price * (1 - applicableDiscount.percentage / 100);
  };

  const calculateProcessingCost = (processingIds: string[], curtainOption: CurtainOption) => {
    return processingIds.reduce((total, id) => {
      const processing = curtainOption.processingOptions.find(p => p.id === id);
      return total + (processing?.price || 0);
    }, 0);
  };

  const calculateCosts = () => {
    const primaryFabric = curtainOptions.find(f => f.id === treatment.primaryFabric);
    const secondaryFabric = curtainOptions.find(f => f.id === treatment.secondaryFabric);
    
    let primaryCost = 0;
    let secondaryCost = 0;

    if (primaryFabric) {
      const discountedPrice = calculateBulkDiscount(
        primaryFabric.price,
        treatment.quantity,
        primaryFabric.bulkDiscount
      );
      const processingCost = calculateProcessingCost(
        treatment.primaryProcessing,
        primaryFabric
      );
      primaryCost = (discountedPrice + processingCost) * (treatment.width / 100) * (treatment.height / 100);
    }

    if (secondaryFabric) {
      const discountedPrice = calculateBulkDiscount(
        secondaryFabric.price,
        treatment.quantity,
        secondaryFabric.bulkDiscount
      );
      const processingCost = calculateProcessingCost(
        treatment.secondaryProcessing,
        secondaryFabric
      );
      secondaryCost = (discountedPrice + processingCost) * (treatment.width / 100) * (treatment.height / 100);
    }

    const fabricCost = (primaryCost + secondaryCost) * treatment.quantity;
    const liningCost = LINING_OPTIONS[treatment.lining].price * 
      (treatment.width / 100) * (treatment.height / 100) * treatment.quantity;
    
    const motorizationCost = MOTORIZATION_OPTIONS[treatment.motorization].price * treatment.quantity;
    const installationCost = 25 * treatment.quantity; // Base installation cost
    
    const subtotal = fabricCost + liningCost + motorizationCost + installationCost;
    const vat = subtotal * 0.10;
    const total = subtotal + vat;

    return {
      fabricCost,
      liningCost,
      motorizationCost,
      installationCost,
      subtotal,
      vat,
      total,
      breakdown: {
        primary: primaryCost,
        secondary: secondaryCost,
        quantity: treatment.quantity,
      }
    };
  };

  const validateMaterialCompatibility = () => {
    if (!treatment.primaryFabric || !treatment.secondaryFabric) return true;
    
    const primaryFabric = curtainOptions.find(f => f.id === treatment.primaryFabric);
    return primaryFabric?.compatibleWith?.includes(treatment.secondaryFabric) || false;
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

  const handleProcessingChange = (
    curtainType: 'primary' | 'secondary',
    processingId: string,
    checked: boolean
  ) => {
    setTreatment(prev => ({
      ...prev,
      [`${curtainType}Processing`]: checked
        ? [...prev[`${curtainType}Processing`], processingId]
        : prev[`${curtainType}Processing`].filter(id => id !== processingId)
    }));
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      if (!validateMaterialCompatibility()) {
        setError('Selected materials are not compatible');
        setIsCalculating(false);
        return;
      }
      setError(null);
      setIsCalculating(false);
    }, 1000);
  };

  const handleAddNewCurtain = (type: 'primary' | 'secondary') => {
    setNewCurtainType(type);
    setNewCurtainForm({
      name: '',
      code: '',
      price: 0,
      image: '',
      type: 'regular',
      minQuantity: 1,
      availableStock: 0,
      processingOptions: [],
    });
    setShowNewCurtainModal(true);
  };

  const handleSaveNewCurtain = () => {
    const newCurtain: CurtainOption = {
      id: `${Date.now()}`,
      ...newCurtainForm,
      bulkDiscount: [],
      compatibleWith: [],
    };
    
    setCurtainOptions(prev => [...prev, newCurtain]);
    setTreatment(prev => ({
      ...prev,
      [newCurtainType === 'primary' ? 'primaryFabric' : 'secondaryFabric']: newCurtain.id,
    }));
    
    setShowNewCurtainModal(false);
  };

  const handleSave = () => {
    // Save logic here
  };

  const handlePreview = () => {
    // Preview logic here
  };

  const costs = calculateCosts();

  return (
    <div className="flex flex-col min-h-screen pb-[4.5rem] md:pb-[4rem]">
      <div className="flex-grow max-w-7xl mx-auto w-full py-6 space-y-6 px-4 sm:px-6 lg:px-8">
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
            <CardTitle>Material Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Curtain *
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => handleAddNewCurtain('primary')}
                  >
                    Add New
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {curtainOptions.map(curtain => (
                    <label
                      key={curtain.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        treatment.primaryFabric === curtain.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="primaryFabric"
                        value={curtain.id}
                        checked={treatment.primaryFabric === curtain.id}
                        onChange={(e) => setTreatment(prev => ({ ...prev, primaryFabric: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={curtain.image}
                          alt={curtain.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{curtain.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Code: {curtain.code}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(curtain.price)}/meter
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {treatment.primaryFabric && (
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Processing Options</h4>
                    <div className="space-y-2">
                      {curtainOptions
                        .find(c => c.id === treatment.primaryFabric)
                        ?.processingOptions.map(option => (
                          <label key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={treatment.primaryProcessing.includes(option.id)}
                              onChange={(e) => handleProcessingChange('primary', option.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {option.name} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Secondary Curtain
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => handleAddNewCurtain('secondary')}
                  >
                    Add New
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {curtainOptions.map(curtain => (
                    <label
                      key={curtain.id}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        treatment.secondaryFabric === curtain.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="secondaryFabric"
                        value={curtain.id}
                        checked={treatment.secondaryFabric === curtain.id}
                        onChange={(e) => setTreatment(prev => ({ ...prev, secondaryFabric: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <img
                          src={curtain.image}
                          alt={curtain.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{curtain.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Code: {curtain.code}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(curtain.price)}/meter
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {treatment.secondaryFabric && (
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Processing Options</h4>
                    <div className="space-y-2">
                      {curtainOptions
                        .find(c => c.id === treatment.secondaryFabric)
                        ?.processingOptions.map(option => (
                          <label key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={treatment.secondaryProcessing.includes(option.id)}
                              onChange={(e) => handleProcessingChange('secondary', option.id, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {option.name} {option.price > 0 && `(+${formatCurrency(option.price)})`}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
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

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
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
          <div className="flex space-x-4 w-full sm:w-auto">
            <Button
              variant="outline"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={handlePreview}
              className="flex-1 sm:flex-none"
            >
              Preview Quote
            </Button>
            <Button
              variant="modern"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              className="flex-1 sm:flex-none"
            >
              Save Quote
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showNewCurtainModal}
        onClose={() => setShowNewCurtainModal(false)}
        title={`Add New ${newCurtainType === 'primary' ? 'Primary' : 'Secondary'} Curtain`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Curtain Name
            </label>
            <input
              type="text"
              value={newCurtainForm.name}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code
            </label>
            <input
              type="text"
              value={newCurtainForm.code}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, code: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price per Meter
            </label>
            <input
              type="number"
              step="0.001"
              value={newCurtainForm.price}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={newCurtainForm.image}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, image: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={newCurtainForm.type}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, type: e.target.value as 'regular' | 'premium' | 'luxury' }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="regular">Regular</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Quantity
            </label>
            <input
              type="number"
              min="1"
              value={newCurtainForm.minQuantity}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, minQuantity: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Available Stock
            </label>
            <input
              type="number"
              min="0"
              value={newCurtainForm.availableStock}
              onChange={(e) => setNewCurtainForm(prev => ({ ...prev, availableStock: parseInt(e.target.value) }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowNewCurtainModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewCurtain}
            >
              Add Curtain
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CreateQuotation;