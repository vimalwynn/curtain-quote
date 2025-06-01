import React from 'react';
import { Users, DollarSign, Package, BarChart2, ArrowRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import AreaChart from '../components/dashboard/AreaChart';
import BarChart from '../components/dashboard/BarChart';
import Button from '../components/ui/Button';
import { stats, revenueData, userActivityData, recentActivities, topSellingProducts } from '../data/mockData';
import { formatCurrency } from '../utils/formatCurrency';

export default function Dashboard() {
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6 text-blue-600 dark:text-blue-400" };
    
    switch (iconName) {
      case 'Users':
        return <Users {...iconProps} />;
      case 'DollarSign':
        return <DollarSign {...iconProps} />;
      case 'Package':
        return <Package {...iconProps} />;
      case 'BarChart':
        return <BarChart2 {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const formattedStats = stats.map(stat => ({
    ...stat,
    value: stat.name.includes('Revenue') ? formatCurrency(parseFloat(stat.value.replace(/[^0-9.-]+/g, ''))) : stat.value
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">Export</Button>
          <Button size="sm">View Reports</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {formattedStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.name}
            value={stat.value}
            icon={renderIcon(stat.icon)}
            change={stat.change}
            trend={stat.trend as 'up' | 'down' | 'neutral'}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="sm">
                View Report
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChart data={revenueData} color="#3B82F6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>User Activity</CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="sm">
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={userActivityData} color="#8B5CF6" />
          </CardContent>
        </Card>
      </div>

      {/* Activity and Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 rounded-lg border border-gray-100 dark:border-gray-800 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-center">
              View All Activities
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Product
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Sold
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {topSellingProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {product.sold} units
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(parseFloat(product.revenue.replace(/[^0-9.-]+/g, '')))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-center">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}