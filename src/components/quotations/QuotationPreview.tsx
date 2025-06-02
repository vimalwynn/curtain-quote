import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Card } from '../ui/Card';
import { Building2, Phone, Mail, MapPin, Calendar, FileText, CircleDollarSign, Receipt, User } from 'lucide-react';

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuotationDetails {
  number: string;
  date: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  customer: {
    name: string;
    company?: string;
    address: string;
    phone: string;
    email: string;
  };
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  terms?: string[];
}

interface QuotationPreviewProps {
  quotation: QuotationDetails;
}

export default function QuotationPreview({ quotation }: QuotationPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900" id="quotationPreview">
      {/* Header */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QUOTATION</h1>
            <div className="mt-4 space-y-1">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quote #: {quotation.number}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Date: {formatDate(quotation.date)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Receipt className="h-4 w-4 mr-2" />
                <span>Valid Until: {formatDate(quotation.validUntil)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Al Madaen</h2>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              <p>Curtains & Blinds</p>
              <p>123 Business Avenue</p>
              <p>Manama, Bahrain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Customer Details
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white font-medium">{quotation.customer.name}</p>
            {quotation.customer.company && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Building2 className="h-4 w-4 mr-2" />
                <span>{quotation.customer.company}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{quotation.customer.address}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <span>{quotation.customer.phone}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>{quotation.customer.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-3 text-gray-600 dark:text-gray-400">Description</th>
              <th className="text-right py-3 text-gray-600 dark:text-gray-400">Quantity</th>
              <th className="text-right py-3 text-gray-600 dark:text-gray-400">Unit Price</th>
              <th className="text-right py-3 text-gray-600 dark:text-gray-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {quotation.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-gray-900 dark:text-white">{item.description}</td>
                <td className="py-4 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                <td className="py-4 text-right text-gray-900 dark:text-white">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-4 text-right text-gray-900 dark:text-white">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-800">
              <td colSpan={2}></td>
              <td className="py-4 text-right text-gray-600 dark:text-gray-400">Subtotal</td>
              <td className="py-4 text-right text-gray-900 dark:text-white">
                {formatCurrency(quotation.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="py-4 text-right text-gray-600 dark:text-gray-400">VAT (10%)</td>
              <td className="py-4 text-right text-gray-900 dark:text-white">
                {formatCurrency(quotation.tax)}
              </td>
            </tr>
            <tr className="border-t-2 border-gray-900 dark:border-gray-100">
              <td colSpan={2}></td>
              <td className="py-4 text-right font-semibold text-gray-900 dark:text-white">Total</td>
              <td className="py-4 text-right font-semibold text-gray-900 dark:text-white">
                {formatCurrency(quotation.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Notes */}
        {quotation.notes && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h3>
            <p className="text-gray-600 dark:text-gray-400">{quotation.notes}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        {quotation.terms && quotation.terms.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Terms & Conditions</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              {quotation.terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Thank you for your business</p>
            <p className="mt-2">
              For any inquiries, please contact us at:
              <br />
              +973 1234 5678 | info@almadaen.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}