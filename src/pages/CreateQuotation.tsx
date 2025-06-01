import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Calculator, FileText, Plus, Ruler, Dices } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface CurtainMeasurements {
  width: number;
  height: number;
  fullness: number;
  style: 'wave' | 'pencilPleat';
  lining: 'standard' | 'blackout' | 'thermal';
}

interface FabricDetails {
  name: string;
  pricePerMeter: number;
  patternRepeat: number;
}

interface QuotationItem {
  measurements: CurtainMeasurements;
  fabric: FabricDetails;
  quantity: number;
  totalFabric: number;
  laborCost: number;
  accessories: {
    tracks: number;
    hooks: number;
  };
}

const FULLNESS_RATIOS = {
  wave: 2.5,
  pencilPleat: 2.2
};

const LINING_COSTS = {
  standard: 8,
  blackout: 12,
  thermal: 15
};

const LABOR_COST_PER_METER = 15;
const HOOK_COST = 0.5;
const TRACK_COST_PER_METER = 25;

export default function CreateQuotation() {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<QuotationItem>({
    measurements: {
      width: 0,
      height: 0,
      fullness: 2.5,
      style: 'wave',
      lining: 'standard'
    },
    fabric: {
      name: '',
      pricePerMeter: 0,
      patternRepeat: 0
    },
    quantity: 1,
    totalFabric: 0,
    laborCost: 0,
    accessories: {
      tracks: 0,
      hooks: 0
    }
  });

  const calculateFabricRequired = (measurements: CurtainMeasurements, patternRepeat: number) => {
    const { width, height, style } = measurements;
    const fullness = FULLNESS_RATIOS[style];
    
    // Calculate basic fabric requirement
    let fabricWidth = width * fullness;
    
    // Add extra for pattern matching if there's a pattern repeat
    if (patternRepeat > 0) {
      const repeatsNeeded = Math.ceil(height / patternRepeat);
      height += patternRepeat * (repeatsNeeded - 1);
    }
    
    // Add extra for hems and headers
    const totalHeight = height + 0.3; // 30cm extra for hems and header
    
    // Calculate total fabric needed in square meters
    return (fabricWidth * totalHeight);
  };

  const calculateHooksRequired = (width: number, style: 'wave' | 'pencilPleat') => {
    const hooksPerMeter = style === 'wave' ? 6 : 8;
    return Math.ceil(width * hooksPerMeter);
  };

  useEffect(() => {
    if (currentItem.measurements.width && currentItem.measurements.height) {
      const totalFabric = calculateFabricRequired(
        currentItem.measurements,
        currentItem.fabric.patternRepeat
      );
      
      const hooks = calculateHooksRequired(
        currentItem.measurements.width,
        currentItem.measurements.style
      );
      
      setCurrentItem(prev => ({
        ...prev,
        totalFabric,
        laborCost: totalFabric * LABOR_COST_PER_METER,
        accessories: {
          tracks: currentItem.measurements.width,
          hooks
        }
      }));
    }
  }, [currentItem.measurements, currentItem.fabric.patternRepeat]);

  const handleAddItem = () => {
    if (currentItem.measurements.width && currentItem.measurements.height && currentItem.fabric.name) {
      setItems([...items, currentItem]);
      setCurrentItem({
        measurements: {
          width: 0,
          height: 0,
          fullness: 2.5,
          style: 'wave',
          lining: 'standard'
        },
        fabric: {
          name: '',
          pricePerMeter: 0,
          patternRepeat: 0
        },
        quantity: 1,
        totalFabric: 0,
        laborCost: 0,
        accessories: {
          tracks: 0,
          hooks: 0
        }
      });
    }
  };

  const calculateItemCost = (item: QuotationItem) => {
    const fabricCost = item.totalFabric * item.fabric.pricePerMeter;
    const liningCost = item.totalFabric * LINING_COSTS[item.measurements.lining];
    const accessoriesCost = (
      item.accessories.tracks * TRACK_COST_PER_METER +
      item.accessories.hooks * HOOK_COST
    );
    
    return {
      fabricCost,
      liningCost,
      laborCost: item.laborCost,
      accessoriesCost,
      total: fabricCost + liningCost + item.laborCost + accessoriesCost
    };
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const costs = calculateItemCost(item);
      return sum + (costs.total * item.quantity);
    }, 0);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Curtain Quotation</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCalculationModal(true)} leftIcon={<Calculator className="h-4 w-4" />}>
            Calculate
          </Button>
          <Button onClick={() => setShowPreviewModal(true)} leftIcon={<FileText className="h-4 w-4" />}>
            Preview
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Measurements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentItem.measurements.width || ''}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      measurements: {
                        ...currentItem.measurements,
                        width: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentItem.measurements.height || ''}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      measurements: {
                        ...currentItem.measurements,
                        height: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Style
                </label>
                <select
                  value={currentItem.measurements.style}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    measurements: {
                      ...currentItem.measurements,
                      style: e.target.value as 'wave' | 'pencilPleat',
                      fullness: FULLNESS_RATIOS[e.target.value as 'wave' | 'pencilPleat']
                    }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="wave">Wave</option>
                  <option value="pencilPleat">Pencil Pleat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lining
                </label>
                <select
                  value={currentItem.measurements.lining}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    measurements: {
                      ...currentItem.measurements,
                      lining: e.target.value as 'standard' | 'blackout' | 'thermal'
                    }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="standard">Standard</option>
                  <option value="blackout">Blackout</option>
                  <option value="thermal">Thermal</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Dices className="h-5 w-5" />
                Fabric Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fabric Name
                </label>
                <input
                  type="text"
                  value={currentItem.fabric.name}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    fabric: {
                      ...currentItem.fabric,
                      name: e.target.value
                    }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price per Meter
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.fabric.pricePerMeter || ''}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    fabric: {
                      ...currentItem.fabric,
                      pricePerMeter: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pattern Repeat (meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentItem.fabric.patternRepeat || ''}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    fabric: {
                      ...currentItem.fabric,
                      patternRepeat: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({
                    ...currentItem,
                    quantity: parseInt(e.target.value)
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddItem} leftIcon={<Plus className="h-4 w-4" />}>
              Add to Quote
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {items.map((item, index) => {
          const costs = calculateItemCost(item);
          return (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.fabric.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.measurements.width}m × {item.measurements.height}m - {item.measurements.style}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.measurements.lining} lining - Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-lg">
                    {formatCurrency(costs.total * item.quantity)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        title="Calculation Details"
      >
        <div className="space-y-6">
          {items.map((item, index) => {
            const costs = calculateItemCost(item);
            return (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                <h3 className="font-semibold text-lg mb-4">{item.fabric.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fabric Required:</span>
                    <span>{item.totalFabric.toFixed(2)} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fabric Cost:</span>
                    <span>{formatCurrency(costs.fabricCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lining Cost:</span>
                    <span>{formatCurrency(costs.liningCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span>{formatCurrency(costs.laborCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessories:</span>
                    <span>{formatCurrency(costs.accessoriesCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total (×{item.quantity}):</span>
                    <span>{formatCurrency(costs.total * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Quotation Preview"
      >
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold mb-2">Curtain Quotation</h2>
            <p className="text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6">
            {items.map((item, index) => {
              const costs = calculateItemCost(item);
              return (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.fabric.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Dimensions: {item.measurements.width}m × {item.measurements.height}m</p>
                        <p>Style: {item.measurements.style}</p>
                        <p>Lining: {item.measurements.lining}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(costs.total * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 pt-4">
            <p>Terms and Conditions:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>50% deposit required to confirm order</li>
              <li>Delivery time: 2-3 weeks from confirmation</li>
              <li>Price includes installation</li>
              <li>Warranty: 1 year on hardware</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}