import { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showAxis?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export default function BarChart({
  data,
  color = '#3B82F6',
  height = 300,
  showAxis = true,
  showGrid = true,
  showTooltip = true,
}: BarChartProps) {
  const { theme } = useTheme();
  
  const chartTheme = useMemo(() => {
    return {
      textColor: theme === 'dark' ? '#9CA3AF' : '#6B7280',
      gridColor: theme === 'dark' ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)',
      backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
    };
  }, [theme]);

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          barSize={30}
        >
          {showGrid && (
            <CartesianGrid stroke={chartTheme.gridColor} strokeDasharray="3 3" vertical={false} />
          )}
          
          {showAxis && (
            <>
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={{ stroke: chartTheme.gridColor }}
                tick={{ fill: chartTheme.textColor, fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: chartTheme.textColor, fontSize: 12 }}
              />
            </>
          )}
          
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.backgroundColor,
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '8px 12px',
              }}
              itemStyle={{ color: chartTheme.textColor }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              cursor={{ fill: theme === 'dark' ? 'rgba(55, 65, 81, 0.4)' : 'rgba(243, 244, 246, 0.8)' }}
            />
          )}
          
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            animationDuration={750}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}