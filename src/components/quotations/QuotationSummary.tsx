import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FileText, Calendar, CircleDollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface QuotationSummaryProps {
  quotation: {
    number: string;
    date: string;
    validUntil: string;
    customer: {
      name: string;
      company?: string;
      address: string;
      phone: string;
      email: string;
    };
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    terms?: string[];
  };
}

export default function QuotationSummary({ quotation }: QuotationSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Quotation Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Reference Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Quote #:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{quotation.number}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{formatDate(quotation.date)}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Valid Until:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{formatDate(quotation.validUntil)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Customer Information</h3>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quotation.customer.name}</span>
              </div>
              {quotation.customer.company && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{quotation.customer.company}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {quotation.customer.phone} | {quotation.customer.email}
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Items</h3>
            <div className="space-y-2">
              {quotation.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.description} (x{item.quantity})
                  </span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Tax (10%):</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.tax)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(quotation.notes || (quotation.terms && quotation.terms.length > 0)) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {quotation.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{quotation.notes}</p>
                </div>
              )}
              {quotation.terms && quotation.terms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Terms</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {quotation.terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}