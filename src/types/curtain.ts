export interface ProcessingOption {
  id: string;
  name: string;
  price: number;
}

export interface BulkDiscount {
  quantity: number;
  percentage: number;
}

export interface CurtainOption {
  id: string;
  name: string;
  code: string;
  price: number;
  image: string;
  type: 'regular' | 'premium' | 'luxury';
  minQuantity: number;
  bulkDiscount?: BulkDiscount[];
  availableStock: number;
  processingOptions: ProcessingOption[];
  compatibleWith?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  requiresSecondaryFabric: boolean;
  compatibleFabrics: {
    primary: string[];
    secondary: string[];
  };
}