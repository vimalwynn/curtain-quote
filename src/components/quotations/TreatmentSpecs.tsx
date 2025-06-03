import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Ruler, Layers, Scissors } from 'lucide-react';

interface WindowTreatment {
  roomName: string;
  width: number;
  height: number;
  style: 'wave' | 'pencilPleat';
  railType: 'standard' | 'deluxe' | 'motorized';
  lining: 'none' | 'standard' | 'blackout' | 'thermal';
  quantity: number;
  frontLayer: {
    name: string;
    pricePerMeter: number;
  };
  secondLayer: {
    name: string;
    pricePerMeter: number;
  } | null;
  mountType: 'inside' | 'outside';
  hardware: {
    brackets: number;
    finials: number;
    tiebacks: boolean;
  };
  trim?: string;
  specialRequirements?: string;
}

interface TreatmentSpecsProps {
  treatment: WindowTreatment;
  view: 'detailed' | 'summary';
}

const mToCm = (meters: number) => Math.round(meters * 100);

export default function TreatmentSpecs({ treatment, view }: TreatmentSpecsProps) {
  if (view === 'summary') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Window:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.roomName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Dimensions:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {mToCm(treatment.width)}cm × {mToCm(treatment.height)}cm
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Style:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.style}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Rail:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.railType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Lining:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.lining}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.quantity}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Front Layer:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{treatment.frontLayer.name}</span>
            </div>
            {treatment.secondLayer && (
              <div className="col-span-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Second Layer:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{treatment.secondLayer.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          {treatment.roomName} Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Measurements & Style
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Width:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{mToCm(treatment.width)}cm</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Height:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{mToCm(treatment.height)}cm</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Style:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{treatment.style}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Mount Type:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{treatment.mountType}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Panel Layout
            </h4>
            <PanelVisualization
              width={treatment.measurements.width}
              height={treatment.measurements.height}
              panelCalc={calculateOptimalPanels(treatment.measurements.width)}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Fabric & Materials
            </h4>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Front Layer:</div>
                <div className="pl-4 text-sm text-gray-900 dark:text-white">
                  {treatment.frontLayer.name}
                </div>
              </div>
              {treatment.secondLayer && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Second Layer:</div>
                  <div className="pl-4 text-sm text-gray-900 dark:text-white">
                    {treatment.secondLayer.name}
                  </div>
                </div>
              )}
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Lining:</div>
                <div className="pl-4 text-sm text-gray-900 dark:text-white">
                  {treatment.lining}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Hardware & Details
            </h4>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Rail System:</div>
                <div className="pl-4 text-sm text-gray-900 dark:text-white">
                  {treatment.railType} Track System
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Hardware:</div>
                <div className="pl-4 space-y-1 text-sm text-gray-900 dark:text-white">
                  <div>Brackets: {treatment.hardware.brackets} pieces</div>
                  <div>Finials: {treatment.hardware.finials} pieces</div>
                  <div>Tiebacks: {treatment.hardware.tiebacks ? 'Yes' : 'No'}</div>
                </div>
              </div>
              {treatment.trim && (
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Trim:</div>
                  <div className="pl-4 text-sm text-gray-900 dark:text-white">
                    {treatment.trim}
                  </div>
                </div>
              )}
            </div>
          </div>

          {treatment.specialRequirements && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Special Requirements
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {treatment.specialRequirements}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Quantity:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {treatment.quantity} {treatment.quantity === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}