import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Save, FileText, Plus, AlertCircle, Download, Printer } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import QuotationPreview from '../components/quotations/QuotationPreview';
import { generatePDF, printDocument } from '../utils/print';

export default function CreateQuotation() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <div className="pb-24"> {/* Add padding to account for fixed footer */}
      {/* ... (previous content remains the same until the buttons) ... */}

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Quotation Preview"
      >
        {/* ... (modal content remains the same) ... */}
      </Modal>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={handlePreview}
            >
              Preview Quote
            </Button>
            <Button
              variant="modern"
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}