import React from 'react';
import { PanelCalculation } from '../../utils/fabricCalculations';

interface PanelVisualizationProps {
  width: number;
  height: number;
  panelCalc: PanelCalculation;
}

export default function PanelVisualization({ width, height, panelCalc }: PanelVisualizationProps) {
  const { totalPanels, panelWidth, warning } = panelCalc;
  
  // Scale the visualization to fit the container
  const scale = 200 / Math.max(width, height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  
  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4" style={{ width: scaledWidth + 40, height: scaledHeight + 40 }}>
        <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
          {Array.from({ length: totalPanels }).map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 border-l-2 border-gray-300 dark:border-gray-600"
              style={{ left: `${(index + 1) * (100 / totalPanels)}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total Panels: {totalPanels}</span>
          <span>Panel Width: {Math.round(panelWidth * 100)}cm</span>
        </div>
        
        {warning && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ {warning}
          </p>
        )}
      </div>
    </div>
  );
}