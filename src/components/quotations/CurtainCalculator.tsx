import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Calculator, Ruler, AlertCircle } from 'lucide-react';
import { calculateFabricRequirements } from '../../utils/fabricCalculations';
import PanelVisualization from './PanelVisualization';

interface CurtainCalculatorProps {
  onCalculate?: (results: any) => void;
}

const MIN_DIMENSION = 50; // 50cm
const MAX_DIMENSION = 1000; // 10m
const MIN_WINDOWS = 1;
const MAX_WINDOWS = 100;
const DEFAULT_WIDTH = 300; // 300cm
const DEFAULT_HEIGHT = 300; // 300cm

const RAIL_TO_STYLE_MAPPING = {
  'wave': 'wave',
  'easyMovable': 'pencilPleat'
} as const;

type RailType = keyof typeof RAIL_TO_STYLE_MAPPING;
type StitchingStyle = typeof RAIL_TO_STYLE_MAPPING[RailType];

export default function CurtainCalculator({ onCalculate }: CurtainCalculatorProps) {
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH / 100, // convert to meters
    height: DEFAULT_HEIGHT / 100, // convert to meters
    fullness: 3,
    fabricWidth: 'regular' as 'regular' | 'chiffon',
    railType: 'wave' as RailType,
    style: RAIL_TO_STYLE_MAPPING['wave'] as StitchingStyle,
    windows: 1,
    hasPattern: false
  });

  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = useCallback(() => {
    if (dimensions.width < MIN_DIMENSION || dimensions.width > MAX_DIMENSION) {
      return `Width must be between ${MIN_DIMENSION}cm and ${MAX_DIMENSION}cm`;
    }
    if (dimensions.height < MIN_DIMENSION || dimensions.height > MAX_DIMENSION) {
      return `Height must be between ${MIN_DIMENSION}cm and ${MAX_DIMENSION}cm`;
    }
    if (dimensions.windows < MIN_WINDOWS || dimensions.windows > MAX_WINDOWS) {
      return `Number of windows must be between ${MIN_WINDOWS} and ${MAX_WINDOWS}`;
    }
    return null;
  }, [dimensions]);

  const handleCalculate = () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    try {
      const widthInMeters = dimensions.width / 100;
      const heightInMeters = dimensions.height / 100;
      
      const calculation = calculateFabricRequirements(
        widthInMeters,
        heightInMeters,
        dimensions.fullness,
        dimensions.fabricWidth,
        dimensions.hasPattern
      );

      const totalResults = {
        ...calculation,
        totalWindows: dimensions.windows,
        totalFabricAllWindows: calculation.totalFabric * dimensions.windows,
        style: dimensions.style
      };

      setResults(totalResults);
      if (onCalculate) {
        onCalculate(totalResults);
      }
    } catch (err) {
      setError('An error occurred while calculating. Please check your inputs.');
    }
  };

  const handleDimensionChange = (field: keyof typeof dimensions, value: number | string | boolean) => {
    if (field === 'railType') {
      const railType = value as RailType;
      setDimensions(prev => ({
        ...prev,
        [field]: railType,
        style: RAIL_TO_STYLE_MAPPING[railType]
      }));
    } else {
      setDimensions(prev => ({ ...prev, [field]: value }));
    }
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Curtain Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Window Width (cm)
              </label>
              <input
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={dimensions.width}
                onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Window Height (cm)
              </label>
              <input
                type="number"
                min={MIN_DIMENSION}
                max={MAX_DIMENSION}
                value={dimensions.height}
                onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fullness Ratio
              </label>
              <select
                value={dimensions.fullness}
                onChange={(e) => handleDimensionChange('fullness', Number(e.target.value))}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
                <option value={2.5}>2.5x</option>
                <option value={3}>3x (Recommended)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fabric Width
              </label>
              <select
                value={dimensions.fabricWidth}
                onChange={(e) => handleDimensionChange('fabricWidth', e.target.value)}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="regular">Regular (140cm)</option>
                <option value="chiffon">Chiffon (280cm)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rail Type
              </label>
              <select
                value={dimensions.railType}
                onChange={(e) => handleDimensionChange('railType', e.target.value as RailType)}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="wave">Wave Rail</option>
                <option value="easyMovable">Easy Movable Track</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stitching Style
              </label>
              <input
                type="text"
                value={dimensions.style === 'wave' ? 'Wave Curtain' : 'Pencil Pleat'}
                disabled
                className="w-full h-12 text-lg rounded-md border-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Style is automatically set based on rail type
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Windows
              </label>
              <input
                type="number"
                min={MIN_WINDOWS}
                max={MAX_WINDOWS}
                value={dimensions.windows}
                onChange={(e) => handleDimensionChange('windows', Number(e.target.value))}
                className="w-full h-12 text-lg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasPattern"
              checked={dimensions.hasPattern}
              onChange={(e) => handleDimensionChange('hasPattern', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
            />
            <label htmlFor="hasPattern" className="text-sm text-gray-700 dark:text-gray-300">
              Pattern matching required
            </label>
          </div>

          <Button
            onClick={handleCalculate}
            leftIcon={<Calculator className="h-4 w-4" />}
            className="w-full"
          >
            Calculate Requirements
          </Button>

          {results && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PanelVisualization
                width={dimensions.width / 100}
                height={dimensions.height / 100}
                panelCalc={results.panels}
                fullness={dimensions.fullness}
                hasPattern={dimensions.hasPattern}
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 font-medium text-gray-900 dark:text-white">
                  Summary for {dimensions.windows} window{dimensions.windows > 1 ? 's' : ''}:
                </div>
                <div>Total Panels: {results.panels.totalPanels * dimensions.windows}</div>
                <div>Fabric per Window: {Math.ceil(results.totalFabric * 100) / 100}m</div>
                <div>Panel Width: {Math.round(results.panels.panelWidth * 100)}cm</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Total Fabric Required: {Math.ceil(results.totalFabricAllWindows * 100) / 100}m
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}