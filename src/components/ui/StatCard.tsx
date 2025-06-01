import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  change?: number;
  changeTimeframe?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  change,
  changeTimeframe = 'from last month',
  trend = 'neutral',
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
          
          {(description || change !== undefined) && (
            <div className="mt-4">
              {change !== undefined && (
                <div className="flex items-center space-x-1">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      trend === 'up' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                      trend === 'down' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                      trend === 'neutral' && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
                    {trend === 'down' && <ArrowDownRight className="mr-1 h-3 w-3" />}
                    {change > 0 ? `+${change}%` : `${change}%`}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{changeTimeframe}</span>
                </div>
              )}
              
              {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
          {icon}
        </div>
      </div>
    </Card>
  );
}