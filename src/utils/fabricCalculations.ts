export interface PanelCalculation {
  totalPanels: number;
  panelWidth: number;
  isEvenDistribution: boolean;
  warning?: string;
  fabricRequirement: {
    perPanel: number;
    total: number;
    extraForPattern?: number;
  };
}

const MIN_PANEL_WIDTH = 0.5; // 50cm minimum
const MAX_PANEL_WIDTH = 1.5; // 150cm maximum
const OPTIMAL_PANEL_WIDTH = 1.2; // 120cm optimal
const PATTERN_REPEAT_EXTRA = 0.15; // 15cm extra for pattern matching
const TOP_BOTTOM_ALLOWANCE = 0.3; // 30cm for hems and headers

export function calculateOptimalPanels(
  totalWidth: number, 
  height: number, 
  fullness: number, 
  hasPattern: boolean = false
): PanelCalculation {
  // Initial calculation
  const minPanels = Math.ceil(totalWidth / MAX_PANEL_WIDTH);
  const maxPanels = Math.floor(totalWidth / MIN_PANEL_WIDTH);
  
  // Start with optimal width
  let bestPanelCount = Math.round(totalWidth / OPTIMAL_PANEL_WIDTH);
  bestPanelCount = Math.max(minPanels, Math.min(maxPanels, bestPanelCount));
  
  const panelWidth = totalWidth / bestPanelCount;
  
  // Calculate fabric requirements
  const fabricWidthPerPanel = panelWidth * fullness;
  const fabricHeightPerPanel = height + TOP_BOTTOM_ALLOWANCE;
  const basicFabricPerPanel = fabricWidthPerPanel * fabricHeightPerPanel;
  
  // Add extra for pattern matching if needed
  const extraForPattern = hasPattern ? 
    PATTERN_REPEAT_EXTRA * bestPanelCount : 0;
  
  const totalFabric = (basicFabricPerPanel * bestPanelCount) + extraForPattern;
  
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
    warning,
    fabricRequirement: {
      perPanel: basicFabricPerPanel,
      total: totalFabric,
      extraForPattern: hasPattern ? extraForPattern : undefined
    }
  };
}

export function calculateFabricRequirements(
  width: number, 
  height: number, 
  fullness: number, 
  hasPattern: boolean = false
): {
  totalFabric: number;
  fabricPerPanel: number;
  panels: PanelCalculation;
} {
  const panels = calculateOptimalPanels(width, height, fullness, hasPattern);
  
  return {
    totalFabric: panels.fabricRequirement.total,
    fabricPerPanel: panels.fabricRequirement.perPanel,
    panels
  };
}