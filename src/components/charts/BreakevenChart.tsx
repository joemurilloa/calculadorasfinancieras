'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { BreakevenResult } from '@/hooks/useBreakevenCalculator';
import { formatCurrency } from '@/lib/formatters';

interface BreakevenChartProps {
  result: BreakevenResult;
}

export const BreakevenChart: React.FC<BreakevenChartProps> = ({ result }) => {
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
    }>;
    label?: number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            {`Unidades: ${label?.toLocaleString()}`}
          </p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={result.chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-slate-200 dark:stroke-slate-700" 
          />
          <XAxis 
            dataKey="units"
            className="text-xs fill-slate-600 dark:fill-slate-400"
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <YAxis 
            className="text-xs fill-slate-600 dark:fill-slate-400"
            tickFormatter={(value: number) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px'
            }}
          />
          
          {/* Revenue Line */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            name="Ingresos"
            dot={false}
            activeDot={{ r: 6, fill: '#10b981' }}
          />
          
          {/* Total Costs Line */}
          <Line
            type="monotone"
            dataKey="totalCosts"
            stroke="#ef4444"
            strokeWidth={3}
            name="Costos Totales"
            dot={false}
            activeDot={{ r: 6, fill: '#ef4444' }}
          />
          
          {/* Fixed Costs Line */}
          <Line
            type="monotone"
            dataKey="fixedCosts"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Costos Fijos"
            dot={false}
          />
          
          {/* Breakeven Point Reference Line */}
          <ReferenceLine 
            x={Math.ceil(result.breakevenUnits)} 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="8 8"
            label={{
              value: `BEP: ${Math.ceil(result.breakevenUnits).toLocaleString()} unidades`,
              position: 'top',
              className: 'fill-blue-600 dark:fill-blue-400 text-sm font-medium'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
          <span className="text-slate-600 dark:text-slate-400">Zona de Ganancia</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
          <span className="text-slate-600 dark:text-slate-400">Zona de Pérdida</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-blue-500 border-dashed mr-2"></div>
          <span className="text-slate-600 dark:text-slate-400">Punto de Equilibrio</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-amber-500 border-dashed mr-2"></div>
          <span className="text-slate-600 dark:text-slate-400">Costos Fijos</span>
        </div>
      </div>
    </div>
  );
};
