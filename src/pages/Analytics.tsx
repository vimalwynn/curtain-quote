import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AreaChart from '../components/dashboard/AreaChart';
import BarChart from '../components/dashboard/BarChart';
import { revenueData, userActivityData } from '../data/mockData';
import { Download, Calendar } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('monthly');
  
  const conversionData = [
    { name: 'Jan', value: 3.2 },
    { name: 'Feb', value: 3.5 },
    { name: 'Mar', value: 3.8 },
    { name: 'Apr', value: 4.1 },
    { name: 'May', value: 3.9 },
    { name: 'Jun', value: 4.3 },
    { name: 'Jul', value: 4.5 },
    { name: 'Aug', value: 4.8 },
    { name: 'Sep', value: 4.6 },
    { name: 'Oct', value: 5.0 },
    { name: 'Nov', value: 5.2 },
    { name: 'Dec', value: 5.5 },
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Audio', value: 22 },
    { name: 'Wearables', value: 18 },
    { name: 'Accessories', value: 28 },
    { name: 'Storage', value: 15 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            {timeRange === 'daily' ? 'Daily' : 
             timeRange === 'weekly' ? 'Weekly' : 
             timeRange === 'monthly' ? 'Monthly' : 'Yearly'}
          </Button>
          <Button 
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant={timeRange === 'daily' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 'weekly' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 'monthly' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 'yearly' ? 'primary' : 'outline'}
                onClick={() => setTimeRange('yearly')}
              >
                Yearly
              </Button>
            </div>
            <AreaChart data={revenueData} color="#3B82F6" height={350} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button size="sm" variant="primary">All Users</Button>
              <Button size="sm" variant="outline">New Users</Button>
              <Button size="sm" variant="outline">Active Users</Button>
            </div>
            <BarChart data={userActivityData} color="#8B5CF6" height={350} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.3%</p>
              </div>
              <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                +0.8% from last month
              </div>
            </div>
            <AreaChart data={conversionData} color="#10B981" height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$54,350</p>
              </div>
              <select className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500">
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>
            <BarChart data={categoryData} color="#F97316" height={300} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Direct</p>
                  <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">42%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Search</p>
                  <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">28%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Social</p>
                  <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">16%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: '16%' }}></div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral</p>
                  <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">14%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}