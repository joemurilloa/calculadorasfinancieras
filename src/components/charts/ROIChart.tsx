"use client";
import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { ROIResult } from '@/hooks/useROICalculator';

interface ROIChartProps {
  data: ROIResult;
}

export const ROIChart: React.FC<ROIChartProps> = ({ data }) => {
  // Prepare chart data
  const chartData = data.timeline.map((month) => ({
    month: `Mes ${month.month}`,
    monthNumber: month.month,
    cumulativeCashFlow: month.cumulative_cash_flow,
    monthlyReturn: month.monthly_return,
    npv: month.net_present_value,
    paybackAchieved: month.payback_achieved
  }));

  // Custom tooltip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{label}</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value?.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Scenarios data for comparison
  const scenariosData = Object.entries(data.scenarios).map(([, scenario]) => ({
    scenario: scenario.scenario_name,
    roi: scenario.roi_percentage,
    npv: scenario.npv,
    payback: scenario.payback_months || 0
  }));

  return (
    <div className="space-y-8">
      {/* Cumulative Cash Flow Timeline */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          Flujo de Caja Acumulado
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs text-slate-600 dark:text-slate-400"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs text-slate-600 dark:text-slate-400"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Zero line for reference */}
              <Line 
                dataKey={() => 0} 
                stroke="#64748b" 
                strokeDasharray="2 2" 
                strokeWidth={1}
                dot={false}
                name="Punto de equilibrio"
              />
              
              {/* Area chart showing cash flow progression */}
              <Area
                type="monotone"
                dataKey="cumulativeCashFlow"
                fill="#3b82f6"
                fillOpacity={0.2}
                stroke="#3b82f6"
                strokeWidth={2}
                name="Flujo Acumulado"
              />
              
              {/* Monthly returns as bars */}
              <Bar
                dataKey="monthlyReturn"
                fill="#10b981"
                fillOpacity={0.6}
                name="Retorno Mensual"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NPV Progression */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          Evolución del Valor Presente Neto
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs text-slate-600 dark:text-slate-400"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs text-slate-600 dark:text-slate-400"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="npv"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                name="NPV"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenarios Comparison */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          Comparación de Escenarios
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenariosData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="scenario" 
                className="text-xs text-slate-600 dark:text-slate-400"
              />
              <YAxis 
                className="text-xs text-slate-600 dark:text-slate-400"
                tickFormatter={(value) => `${value.toFixed(0)}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'ROI']}
                labelFormatter={(label) => `Escenario: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="roi"
                name="ROI (%)"
                fill="#3b82f6"
              >
                {scenariosData.map((entry, index) => (
                  <Bar 
                    key={index}
                    fill={
                      entry.roi > 20 ? "#10b981" : 
                      entry.roi > 0 ? "#f59e0b" : 
                      "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payback Period Visualization */}
      {data.metrics.payback_period_months && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Período de Recuperación
          </h4>
          <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 dark:from-red-900/20 dark:via-yellow-900/20 dark:to-green-900/20 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-slate-600">Inicio</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min((data.metrics.payback_period_months / data.timeline.length) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div 
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{ 
                      left: `${data.metrics.payback_period_months ? Math.min((data.metrics.payback_period_months / data.timeline.length) * 100, 100) : 0}%` 
                    }}
                  >
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-600 whitespace-nowrap">
                      {data.metrics.payback_period_months ? data.metrics.payback_period_months.toFixed(1) : '0.0'} meses
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.timeline.length}</div>
                <div className="text-sm text-slate-600">Final</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
