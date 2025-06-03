import React from 'react';
import { PanelCalculation } from '../../utils/fabricCalculations';
import { Ruler } from 'lucide-react';

interface PanelVisualizationProps {
  width: number;
  height: number;
  panelCalc: PanelCalculation;
  fullness: number;
  hasPattern?: boolean;
}

export default function PanelVisualization({ 
  width, 
  height, 
  panelCalc, 
  fullness,
  hasPattern = false 
}: PanelVisualizationProps) {
  const { totalPanels, panelWidth, warning, fabricRequirement } = panelCalc;
  
  // Scale the visualization to fit the container
  const scale = 200 / Math.max(width, height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  
  return (
    <div className="space-y-4">
      <div 
        className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4" 
        style={{ width: scaledWidth + 40, height: scaledHeight + 40 }}
      >
        <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
          {Array.from({ length: totalPanels }).map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 border-l-2 border-gray-300 dark:border-gray-600"
              style={{ left: `${(index + 1) * (100 / totalPanels)}%` }}
            />
          ))}
        </div>
        
        {/* Fullness indicator */}
        <div 
          className="absolute -top-2 left-4 right-4 h-1 bg-blue-500 opacity-50"
          style={{ transform: `scaleX(${fullness})`, transformOrigin: 'left' }}
        />
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span>Panels: {totalPanels}</span>
          </div>
          <div>Width per panel: {Math.round(panelWidth * 100)}cm</div>
          <div>Fabric per panel: {Math.round(fabricRequirement.perPanel * 100) / 100}m²</div>
          <div>Total fabric: {Math.round(fabricRequirement.total * 100) / 100}m²</div>
          {hasPattern && fabricRequirement.extraForPattern && (
            <div className="col-span-2">
              Pattern matching allowance: {Math.round(fabricRequirement.extraForPattern * 100)}cm
            </div>
          )}
        </div>
        
        {warning && (
          <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
            ⚠️ {warning}
          </p>
        )}
      </div>
    </div>
  );
}