import { CurtainOption } from '../types/curtain';

// User data
export const users = [
  // ... existing user data
];

// Product categories
export const PRODUCT_CATEGORIES = {
  CURTAINS: 'curtains',
  BLINDS: 'blinds',
  DRAPES: 'drapes'
} as const;

// Product data with fabric compatibility
export const products = [
  {
    id: '1',
    name: 'Wave Curtains',
    category: PRODUCT_CATEGORIES.CURTAINS,
    price: 45.99,
    stock: 150,
    rating: 4.8,
    requiresSecondaryFabric: true,
    compatibleFabrics: {
      primary: ['1', '2', '3'],
      secondary: ['2', '3']
    }
  },
  {
    id: '2',
    name: 'Pencil Pleat Curtains',
    category: PRODUCT_CATEGORIES.CURTAINS,
    price: 55.99,
    stock: 120,
    rating: 4.9,
    requiresSecondaryFabric: false,
    compatibleFabrics: {
      primary: ['1', '2'],
      secondary: []
    }
  },
  {
    id: '3',
    name: 'Roller Blinds',
    category: PRODUCT_CATEGORIES.BLINDS,
    price: 35.99,
    stock: 180,
    rating: 4.6,
    requiresSecondaryFabric: false,
    compatibleFabrics: {
      primary: ['2', '3'],
      secondary: []
    }
  }
];

// Fabric options with detailed specifications
export const fabricOptions: CurtainOption[] = [
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

// Other existing mock data...
export const stats = [
  // ... existing stats data
];

export const revenueData = [
  // ... existing revenue data
];

export const userActivityData = [
  // ... existing user activity data
];

export const recentActivities = [
  // ... existing activities data
];

export const topSellingProducts = [
  // ... existing top selling products data
];