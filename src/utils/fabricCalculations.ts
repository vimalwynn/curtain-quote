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

const MIN_PANEL_WIDTH = 50; // 50cm minimum
const MAX_PANEL_WIDTH = 150; // 150cm maximum
const OPTIMAL_PANEL_WIDTH = 120; // 120cm optimal
const PATTERN_REPEAT_EXTRA = 15; // 15cm extra for pattern matching
const TOP_BOTTOM_ALLOWANCE = 30; // 30cm for hems and headers

export function calculateOptimalPanels(
  widthInCm: number, 
  heightInCm: number, 
  fullness: number, 
  hasPattern: boolean = false
): PanelCalculation {
  // Convert measurements to meters for calculations
  const width = widthInCm / 100;
  const height = heightInCm / 100;
  const minPanelWidth = MIN_PANEL_WIDTH / 100;
  const maxPanelWidth = MAX_PANEL_WIDTH / 100;
  const optimalPanelWidth = OPTIMAL_PANEL_WIDTH / 100;
  const patternExtra = PATTERN_REPEAT_EXTRA / 100;
  const hemAllowance = TOP_BOTTOM_ALLOWANCE / 100;
  
  // Initial calculation
  const minPanels = Math.ceil(width / maxPanelWidth);
  const maxPanels = Math.floor(width / minPanelWidth);
  
  // Start with optimal width
  let bestPanelCount = Math.round(width / optimalPanelWidth);
  bestPanelCount = Math.max(minPanels, Math.min(maxPanels, bestPanelCount));
  
  const panelWidth = width / bestPanelCount;
  
  // Calculate fabric requirements
  const fabricWidthPerPanel = panelWidth * fullness;
  const fabricHeightPerPanel = height + hemAllowance;
  const basicFabricPerPanel = fabricWidthPerPanel * fabricHeightPerPanel;
  
  // Add extra for pattern matching if needed
  const extraForPattern = hasPattern ? 
    patternExtra * bestPanelCount : 0;
  
  const totalFabric = (basicFabricPerPanel * bestPanelCount) + extraForPattern;
  
  // Check if we have an even distribution
  const isEvenDistribution = Math.abs(panelWidth - optimalPanelWidth) < 0.1;
  
  // Generate warnings if needed
  let warning: string | undefined;
  if (panelWidth < 0.7) {
    warning = 'Panels are narrower than recommended';
  } else if (panelWidth > 1.4) {
    warning = 'Panels are wider than recommended';
  }
  
  return {
    totalPanels: bestPanelCount,
    panelWidth: Math.round(panelWidth * 100) / 100, // Convert back to meters, rounded to 2 decimals
    isEvenDistribution,
    warning,
    fabricRequirement: {
      perPanel: Math.round(basicFabricPerPanel * 100) / 100,
      total: Math.round(totalFabric * 100) / 100,
      extraForPattern: hasPattern ? Math.round(extraForPattern * 100) / 100 : undefined
    }
  };
}

export function calculateFabricRequirements(
  widthInCm: number, 
  heightInCm: number, 
  fullness: number, 
  fabricWidth: 'regular' | 'chiffon' = 'regular',
  hasPattern: boolean = false
): {
  totalFabric: number;
  fabricPerPanel: number;
  panels: PanelCalculation;
} {
  const panels = calculateOptimalPanels(widthInCm, heightInCm, fullness, hasPattern);
  
  // Adjust calculations based on fabric width
  const fabricWidthMultiplier = fabricWidth === 'chiffon' ? 0.5 : 1;
  const adjustedTotalFabric = panels.fabricRequirement.total * fabricWidthMultiplier;
  
  return {
    totalFabric: Math.round(adjustedTotalFabric * 100) / 100,
    fabricPerPanel: Math.round(panels.fabricRequirement.perPanel * 100) / 100,
    panels
  };
}