export const VALIDATION_RULES = {
  DIMENSIONS: {
    MIN_WIDTH: 50,
    MAX_WIDTH: 1000,
    MIN_HEIGHT: 50,
    MAX_HEIGHT: 1000
  },
  QUANTITY: {
    MIN: 1,
    MAX: 100
  }
} as const;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateDimensions(width: number, height: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (width < VALIDATION_RULES.DIMENSIONS.MIN_WIDTH) {
    errors.push({ field: 'width', message: `Width must be at least ${VALIDATION_RULES.DIMENSIONS.MIN_WIDTH}cm` });
  }
  if (width > VALIDATION_RULES.DIMENSIONS.MAX_WIDTH) {
    errors.push({ field: 'width', message: `Width cannot exceed ${VALIDATION_RULES.DIMENSIONS.MAX_WIDTH}cm` });
  }
  if (height < VALIDATION_RULES.DIMENSIONS.MIN_HEIGHT) {
    errors.push({ field: 'height', message: `Height must be at least ${VALIDATION_RULES.DIMENSIONS.MIN_HEIGHT}cm` });
  }
  if (height > VALIDATION_RULES.DIMENSIONS.MAX_HEIGHT) {
    errors.push({ field: 'height', message: `Height cannot exceed ${VALIDATION_RULES.DIMENSIONS.MAX_HEIGHT}cm` });
  }
  
  return errors;
}

export function validateCustomerDetails(details: {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!details.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }
  if (!details.address.trim()) {
    errors.push({ field: 'address', message: 'Installation address is required' });
  }
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }
  if (details.contactNumber && !/^\+?[0-9]{8,}$/.test(details.contactNumber)) {
    errors.push({ field: 'contactNumber', message: 'Invalid phone number' });
  }
  
  return errors;
}

export function validateQuantity(quantity: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (quantity < VALIDATION_RULES.QUANTITY.MIN) {
    errors.push({ field: 'quantity', message: `Quantity must be at least ${VALIDATION_RULES.QUANTITY.MIN}` });
  }
  if (quantity > VALIDATION_RULES.QUANTITY.MAX) {
    errors.push({ field: 'quantity', message: `Quantity cannot exceed ${VALIDATION_RULES.QUANTITY.MAX}` });
  }
  
  return errors;
}