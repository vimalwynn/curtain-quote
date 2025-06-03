import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Calculator, FileText, Plus, Ruler, Dices, AlertCircle, Download, Printer, Save } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { products } from '../data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const fabrics = products.filter(product => 
  product.category.toLowerCase().includes('fabric')
);

interface CurtainMeasurements {
  width: number;
  height: number;
  fullness: number;
  style: 'wave' | 'pencilPleat';
  railType: 'standard' | 'deluxe' | 'motorized';
  lining: 'none' | 'standard' | 'blackout' | 'thermal';
}

interface FabricDetails {
  name: string;
  pricePerMeter: number;
}

interface QuotationItem {
  roomName: string;
  measurements: CurtainMeasurements;
  frontLayer: FabricDetails;
  secondLayer: FabricDetails | null;
  quantity: number;
  totalFabric: number;
  laborCost: number;
  accessories: {
    tracks: number;
  };
}

const DEFAULT_WIDTH = 3;
const DEFAULT_HEIGHT = 3;

const FULLNESS_RATIOS = {
  wave: {
    standard: 2.5,
    deluxe: 2.7,
    motorized: 2.8
  },
  pencilPleat: {
    standard: 2.5,
    deluxe: 2.8,
    motorized: 3.0
  }
};

const RAIL_COSTS = {
  standard: {
    wave: 35,
    pencilPleat: 25
  },
  deluxe: {
    wave: 45,
    pencilPleat: 35
  },
  motorized: {
    wave: 120,
    pencilPleat: 100
  }
};

const LINING_COSTS = {
  none: 0,
  standard: 8,
  blackout: 12,
  thermal: 15
};

const LABOR_COST_PER_METER = 15;
const TRACK_COST_PER_METER = 25;
const STITCHING_COST_PER_METER = 8;
const FIXING_COST_PER_METER = 12;

const mToCm = (meters: number) => Math.round(meters * 100);
const cmToM = (cm: number) => cm / 100;

export default function CreateQuotation() {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quotationRef = useRef<HTMLDivElement>(null);
  const [currentItem, setCurrentItem] = useState<QuotationItem>({
    roomName: "Window 1",
    measurements: {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fullness: FULLNESS_RATIOS.wave.standard,
      style: 'wave',
      railType: 'standard',
      lining: 'none'
    },
    frontLayer: {
      name: '',
      pricePerMeter: 0
    },
    secondLayer: null,
    quantity: 1,
    totalFabric: 0,
    laborCost: 0,
    accessories: {
      tracks: 0
    }
  });

  const generatePDF = async () => {
    if (!quotationRef.current || items.length === 0) return;
    
    const canvas = await html2canvas(quotationRef.current, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('curtain-quotation.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateFabricRequired = (measurements: CurtainMeasurements) => {
    const { width, height, style, railType } = measurements;
    const fullness = FULLNESS_RATIOS[style][railType];
    const fabricWidth = width * fullness;
    const totalHeight = height + 0.3;
    return fabricWidth * totalHeight;
  };

  const calculatePanels = (width: number) => {
    const maxPanelWidth = 1.5;
    return Math.ceil(width / maxPanelWidth);
  };

  const calculateDetailedBreakdown = (item: QuotationItem) => {
    const { measurements, frontLayer, secondLayer, quantity } = item;
    const { width, height, style, railType, lining } = measurements;

    const numberOfPanels = calculatePanels(width);
    const panelWidth = width / numberOfPanels;

    const fullness = FULLNESS_RATIOS[style][railType];
    const fabricWidth = width * fullness;
    const fabricHeight = height + 0.3;
    const totalFabricPerCurtain = fabricWidth * fabricHeight;
    
    const totalFabric = totalFabricPerCurtain;
    const trackLength = width;

    const frontLayerCost = totalFabric * frontLayer.pricePerMeter;
    const secondLayerCost = secondLayer ? totalFabric * secondLayer.pricePerMeter : 0;
    const liningCost = totalFabric * LINING_COSTS[lining];
    const stitchingCost = totalFabric * STITCHING_COST_PER_METER;
    const fixingCost = trackLength * FIXING_COST_PER_METER;
    const railCost = RAIL_COSTS[railType][style] * trackLength;

    const subtotal = frontLayerCost + secondLayerCost + liningCost + stitchingCost + fixingCost + railCost;
    const total = subtotal * quantity;

    return {
      dimensions: {
        width: mToCm(width),
        height: mToCm(height),
        panelWidth: mToCm(panelWidth)
      },
      fabric: {
        totalMeters: totalFabric.toFixed(2),
        frontLayerCost,
        secondLayerCost,
        cost: frontLayerCost + secondLayerCost
      },
      panels: {
        count: numberOfPanels,
        fabricPerPanel: (totalFabricPerCurtain / numberOfPanels).toFixed(2)
      },
      lining: {
        type: lining,
        cost: liningCost
      },
      hardware: {
        trackLength: trackLength.toFixed(2),
        railCost
      },
      labor: {
        stitching: stitchingCost,
        fixing: fixingCost
      },
      totals: {
        subtotal,
        quantity,
        total
      }
    };
  };

  useEffect(() => {
    if (currentItem.measurements.width && currentItem.measurements.height) {
      const totalFabric = calculateFabricRequired(currentItem.measurements);
      
      setCurrentItem(prev => ({
        ...prev,
        totalFabric,
        laborCost: totalFabric * LABOR_COST_PER_METER,
        accessories: {
          tracks: currentItem.measurements.width
        }
      }));
    }
  }, [currentItem.measurements]);

  const handleFabricSelect = (fabricId: string, layer: 'front' | 'second') => {
    if (layer === 'front') {
      if (!fabricId) {
        setCurrentItem({
          ...currentItem,
          frontLayer: {
            name: '',
            pricePerMeter: 0
          }
        });
        return;
      }
      
      const selectedFabric = fabrics.find(f => f.id === fabricId);
      if (selectedFabric) {
        setCurrentItem({
          ...currentItem,
          frontLayer: {
            name: selectedFabric.name,
            pricePerMeter: selectedFabric.price
          }
        });
      }
    } else {
      if (fabricId === 'none') {
        setCurrentItem({
          ...currentItem,
          secondLayer: null
        });
        return;
      }
      
      const selectedFabric = fabrics.find(f => f.id === fabricId);
      if (selectedFabric) {
        setCurrentItem({
          ...currentItem,
          secondLayer: {
            name: selectedFabric.name,
            pricePerMeter: selectedFabric.price
          }
        });
      }
    }
  };

  const validateItem = () => {
    if (!currentItem.measurements.width || currentItem.measurements.width <= 0) {
      return 'Width is required and must be greater than 0';
    }
    if (!currentItem.measurements.height || currentItem.measurements.height <= 0) {
      return 'Height is required and must be greater than 0';
    }
    if (!currentItem.frontLayer.name.trim()) {
      return 'Front layer fabric is required';
    }
    if (!currentItem.frontLayer.pricePerMeter || currentItem.frontLayer.pricePerMeter <= 0) {
      return 'Front layer fabric price is required and must be greater than 0';
    }
    if (currentItem.quantity <= 0) {
      return 'Quantity must be greater than 0';
    }
    return null;
  };

  const handleAddItem = () => {
    const validationError = validateItem();
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setItems([...items, currentItem]);
    
    const nextWindowNumber = items.length + 2;
    setCurrentItem({
      roomName: `Window ${nextWindowNumber}`,
      measurements: {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        fullness: FULLNESS_RATIOS.wave.standard,
        style: 'wave',
        railType: 'standard',
        lining: 'none'
      },
      frontLayer: {
        name: '',
        pricePerMeter: 0
      },
      secondLayer: null,
      quantity: 1,
      totalFabric: 0,
      laborCost: 0,
      accessories: {
        tracks: 0
      }
    });
    setError(null);
  };

  const calculateItemCost = (item: QuotationItem) => {
    const frontLayerCost = item.totalFabric * item.frontLayer.pricePerMeter;
    const secondLayerCost = item.secondLayer ? item.totalFabric * item.secondLayer.pricePerMeter : 0;
    const liningCost = item.totalFabric * LINING_COSTS[item.measurements.lining];
    const railCost = RAIL_COSTS[item.measurements.railType][item.measurements.style] * item.accessories.tracks;
    
    return {
      frontLayerCost,
      secondLayerCost,
      liningCost,
      laborCost: item.laborCost,
      railCost,
      total: frontLayerCost + secondLayerCost + liningCost + item.laborCost + railCost
    };
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const costs = calculateItemCost(item);
      return sum + (costs.total * item.quantity);
    }, 0);
  };

  const handleSaveQuotation = async () => {
    if (items.length === 0) {
      setError('Add at least one item to save the quotation');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const quotationData = {
      id: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date().toISOString(),
      items,
      total: calculateTotal(),
      status: 'Draft' as const
    };

    try {
      console.log('Saving quotation:', quotationData);
      alert('Quotation saved successfully!');
    } catch (error) {
      setError('Failed to save quotation. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 max-w-[1400px] mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Curtain Quotation</h1>
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
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Ruler className="h-6 w-6" />
                  Measurements
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room/Window Name
                  </label>
                  <input
                    type="text"
                    value={currentItem.roomName}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      roomName: e.target.value
                    })}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      value={mToCm(currentItem.measurements.width)}
                      onChange={(e) => setCurrentItem({
                        ...currentItem,
                        measurements: {
                          ...currentItem.measurements,
                          width: cmToM(parseInt(e.target.value))
                        }
                      })}
                      className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={mToCm(currentItem.measurements.height)}
                      onChange={(e) => setCurrentItem({
                        ...currentItem,
                        measurements: {
                          ...currentItem.measurements,
                          height: cmToM(parseInt(e.target.value))
                        }
                      })}
                      className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    value={currentItem.measurements.style}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      measurements: {
                        ...currentItem.measurements,
                        style: e.target.value as 'wave' | 'pencilPleat',
                        fullness: FULLNESS_RATIOS[e.target.value as 'wave' | 'pencilPleat'][currentItem.measurements.railType]
                      }
                    })}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="wave">Wave</option>
                    <option value="pencilPleat">Pencil Pleat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rail Type
                  </label>
                  <select
                    value={currentItem.measurements.railType}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      measurements: {
                        ...currentItem.measurements,
                        railType: e.target.value as 'standard' | 'deluxe' | 'motorized',
                        fullness: FULLNESS_RATIOS[currentItem.measurements.style][e.target.value as 'standard' | 'deluxe' | 'motorized']
                      }
                    })}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="standard">Standard Rail</option>
                    <option value="deluxe">Deluxe Rail</option>
                    <option value="motorized">Motorized Rail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lining
                  </label>
                  <select
                    value={currentItem.measurements.lining}
                    onChange={(e) => setCurrentItem({
                      ...currentItem,
                      measurements: {
                        ...currentItem.measurements,
                        lining: e.target.value as 'none' | 'standard' | 'blackout' | 'thermal'
                      }
                    })}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="none">No Lining</option>
                    <option value="standard">Standard</option>
                    <option value="blackout">Blackout</option>
                    <option value="thermal">Thermal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Dices className="h-6 w-6" />
                  Fabric Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Front Layer Fabric
                  </label>
                  <select
                    value={currentItem.frontLayer.name ? fabrics.find(f => f.name === currentItem.frontLayer.name)?.id || '' : ''}
                    onChange={(e) => handleFabricSelect(e.target.value, 'front')}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Select a fabric</option>
                    {fabrics.map(fabric => (
                      <option key={fabric.id} value={fabric.id}>
                        {fabric.name} - {formatCurrency(fabric.price)} per meter
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second Layer Fabric (Optional)
                  </label>
                  <select
                    value={currentItem.secondLayer ? fabrics.find(f => f.name === currentItem.secondLayer.name)?.id || 'none' : 'none'}
                    onChange={(e) => handleFabricSelect(e.target.value, 'second')}
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="none">No second layer</option>
                    {fabrics.map(fabric => (
                      <option key={fabric.id} value={fabric.id}>
                        {fabric.name} - {formatCurrency(fabric.price)} per meter
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleAddItem} 
                leftIcon={<Plus className="h-4 w-4" />}
                size="lg"
              >
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
                      <h3 className="font-semibold text-lg">{item.roomName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Front Layer: {item.frontLayer.name}
                      </p>
                      {item.secondLayer && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Second Layer: {item.secondLayer.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {mToCm(item.measurements.width)}cm × {mToCm(item.measurements.height)}cm - {item.measurements.style}
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
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCalculationModal(true)} 
                leftIcon={<Calculator className="h-4 w-4" />}
              >
                Calculate
              </Button>
              <Button 
                onClick={() => setShowPreviewModal(true)} 
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Preview
              </Button>
            </div>
            <Button 
              variant="modern"
              onClick={handleSaveQuotation}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Quotation
            </Button>
          </div>
        </div>
      </footer>

      <Modal
        isOpen={showCalculationModal}
        onClose={() => setShowCalculationModal(false)}
        title="Detailed Calculation Breakdown"
      >
        <div className="space-y-6">
          {items.map((item, index) => {
            const breakdown = calculateDetailedBreakdown(item);
            return (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                <h3 className="font-semibold text-lg mb-4">{item.roomName}</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Dimensions & Panels</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Width: {breakdown.dimensions.width}cm</div>
                      <div>Height: {breakdown.dimensions.height}cm</div>
                      <div>Number of Panels: {breakdown.panels.count}</div>
                      <div>Panel Width: {breakdown.dimensions.panelWidth}cm</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Fabric Requirements</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Fabric Required:</span>
                        <span>{breakdown.fabric.totalMeters} meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Front Layer Cost:</span>
                        <span>{formatCurrency(breakdown.fabric.frontLayerCost)}</span>
                      </div>
                      {item.secondLayer && (
                        <div className="flex justify-between">
                          <span>Second Layer Cost:</span>
                          <span>{formatCurrency(breakdown.fabric.secondLayerCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Total Fabric Cost:</span>
                        <span>{formatCurrency(breakdown.fabric.cost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Hardware & Labor</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Track Length:</span>
                        <span>{breakdown.hardware.trackLength} meters</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rail Cost:</span>
                        <span>{formatCurrency(breakdown.hardware.railCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stitching Charge:</span>
                        <span>{formatCurrency(breakdown.labor.stitching)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixing Charge:</span>
                        <span>{formatCurrency(breakdown.labor.fixing)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(breakdown.totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Quantity:</span>
                      <span>×{breakdown.totals.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg mt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(breakdown.totals.total)}</span>
                    </div>
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
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handlePrint}
              leftIcon={<Printer className="h-4 w-4" />}
            >
              Print
            </Button>
            <Button
              onClick={generatePDF}
              leftIcon={<Download className="h-4  w-4" />}
            >
              Download PDF
            </Button>
          </div>

          <div ref={quotationRef} className="space-y-6 p-6 bg-white">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-xl font-bold mb-2">Curtain Quotation</h2>
              <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-gray-600">Quote #: QT-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => {
                const costs = calculateItemCost(item);
                return (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.roomName}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Front Layer: {item.frontLayer.name}</p>
                          {item.secondLayer && <p>Second Layer: {item.secondLayer.name}</p>}
                          <p>Dimensions: {mToCm(item.measurements.width)}cm × {mToCm(item.measurements.height)}cm</p>
                          <p>Style: {item.measurements.style}</p>
                          <p>Rail Type: {item.measurements.railType}</p>
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

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 pt-4">
              <p className="font-semibold mb-2">Terms and Conditions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>50% deposit required to confirm order</li>
                <li>Delivery time: 2-3 weeks from confirmation</li>
                <li>Price includes installation</li>
                <li>Warranty: 1 year on hardware</li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold mb-2">Company Details:</p>
                  <p className="text-sm text-gray-600">Curtain & Blinds Co.</p>
                  <p className="text-sm text-gray-600">123 Main Street</p>
                  <p className="text-sm text-gray-600">City, Country</p>
                  <p className="text-sm text-gray-600">Tel: +1234567890</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Bank Details:</p>
                  <p className="text-sm text-gray-600">Bank: National Bank</p>
                  <p className="text-sm text-gray-600">Account: 1234567890</p>
                  <p className="text-sm text-gray-600">IBAN: BH00XXXX1234567890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}