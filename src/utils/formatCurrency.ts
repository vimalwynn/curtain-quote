export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-BH', {
    style: 'currency',
    currency: 'BHD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}