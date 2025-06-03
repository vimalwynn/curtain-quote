export interface PanelCalculation {
  totalPanels: number;
  panelWidth: number;
  isEvenDistribution: boolean;
  warning?: string;
}

const MIN_PANEL_WIDTH = 0.5; // 50cm minimum
const MAX_PANEL_WIDTH = 1.5; // 150cm maximum
const OPTIMAL_PANEL_WIDTH = 1.2; // 120cm optimal

export function calculateOptimalPanels(totalWidth: number): PanelCalculation {
  // Initial calculation
  const minPanels = Math.ceil(totalWidth / MAX_PANEL_WIDTH);
  const maxPanels = Math.floor(totalWidth / MIN_PANEL_WIDTH);
  
  // Start with optimal width
  let bestPanelCount = Math.round(totalWidth / OPTIMAL_PANEL_WIDTH);
  bestPanelCount = Math.max(minPanels, Math.min(maxPanels, bestPanelCount));
  
  const panelWidth = totalWidth / bestPanelCount;
  
  // Check if we have an even distribution
  const isEvenDistribution = Math.abs(panelWidth - OPTIMAL_PANEL_WIDTH) < 0.1;
  
  // Generate warnings if needed
  let warning: string | undefined;
  if (panelWidth < 0.7) {
    warning = 'Panels are narrower than recommended';
  } else if (panelWidth > 1.4) {
    warning = 'Panels are wider than recommended';
  }
  
  return {
    totalPanels: bestPanelCount,
    panelWidth,
    isEvenDistribution,
    warning
  };
}

export function calculateFabricRequirements(width: number, height: number, fullness: number): {
  totalFabric: number;
  fabricPerPanel: number;
  panels: PanelCalculation;
} {
  const panels = calculateOptimalPanels(width);
  const fabricPerPanel = (width * fullness) / panels.totalPanels * (height + 0.3); // 30cm extra for top/bottom
  const totalFabric = fabricPerPanel * panels.totalPanels;
  
  return {
    totalFabric,
    fabricPerPanel,
    panels
  };
}