import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import { Plus, Filter, Search, MoreHorizontal, Edit, Trash2, FileText, Download } from 'lucide-react';

interface Quotation {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  validUntil: string;
}

const mockQuotations: Quotation[] = [
  {
    id: '1',
    number: 'QT-2024-001',
    client: 'Acme Corporation',
    date: '2024-03-15T10:30:00Z',
    amount: 5499.99,
    status: 'Sent',
    validUntil: '2024-04-15T10:30:00Z'
  },
  {
    id: '2',
    number: 'QT-2024-002',
    client: 'TechStart Inc.',
    date: '2024-03-14T15:45:00Z',
    amount: 2999.99,
    status: 'Accepted',
    validUntil: '2024-04-14T15:45:00Z'
  },
  {
    id: '3',
    number: 'QT-2024-003',
    client: 'Global Solutions Ltd',
    date: '2024-03-13T09:15:00Z',
    amount: 8750.00,
    status: 'Draft',
    validUntil: '2024-04-13T09:15:00Z'
  },
  {
    id: '4',
    number: 'QT-2024-004',
    client: 'Innovation Labs',
    date: '2024-03-12T14:20:00Z',
    amount: 4250.00,
    status: 'Declined',
    validUntil: '2024-04-12T14:20:00Z'
  },
  {
    id: '5',
    number: 'QT-2024-005',
    client: 'Digital Dynamics',
    date: '2024-03-11T11:00:00Z',
    amount: 6125.50,
    status: 'Sent',
    validUntil: '2024-04-11T11:00:00Z'
  }
];

export default function Quotations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredQuotations = mockQuotations.filter(quote => 
    quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const columns = [
    {
      key: 'number',
      header: 'Quote Number',
      sortable: true,
      render: (quote: Quotation) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{quote.number}</span>
        </div>
      )
    },
    {
      key: 'client',
      header: 'Client',
      sortable: true,
      render: (quote: Quotation) => (
        <span className="text-gray-900 dark:text-white">{quote.client}</span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (quote: Quotation) => (
        <span className="text-gray-500 dark:text-gray-400">{formatDate(quote.date)}</span>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (quote: Quotation) => (
        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(quote.amount)}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (quote: Quotation) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
          {quote.status}
        </span>
      )
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      sortable: true,
      render: (quote: Quotation) => (
        <span className="text-gray-500 dark:text-gray-400">{formatDate(quote.validUntil)}</span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (quote: Quotation) => (
        <div className="flex space-x-2">
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Download className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
        <Button 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/quotations/create')}
        >
          Create Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Quotes</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">24</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Accepted</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
                  <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Declined</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">4</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredQuotations}
          keyExtractor={(quote) => quote.id}
          zebra={true}
        />
      </div>
    </div>
  );
}