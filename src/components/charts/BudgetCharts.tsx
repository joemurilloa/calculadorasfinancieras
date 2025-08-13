import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BudgetResult } from '@/lib/calculations/budget';

interface BudgetChartsProps {
  result: BudgetResult;
}

const EXPENSE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#84cc16'
];

const INCOME_COLORS = [
  '#10b981', '#059669', '#047857', '#065f46', '#22c55e',
  '#16a34a', '#15803d', '#166534', '#14532d'
];

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ result }) => {
  const { summary, monthlyProjection } = result;

  // Datos para gráfico de gastos por categoría
  const expenseData = Object.entries(summary.expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / summary.totalExpenses) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Datos para gráfico de ingresos por categoría
  const incomeData = Object.entries(summary.incomeByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / summary.totalIncome) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Datos para comparación Ingresos vs Gastos
  const comparisonData = [
    {
      name: 'Ingresos',
      amount: summary.totalIncome,
      fill: '#10b981'
    },
    {
      name: 'Gastos',
      amount: summary.totalExpenses,
      fill: '#ef4444'
    },
    {
      name: 'Balance',
      amount: Math.abs(summary.balance),
      fill: summary.balance >= 0 ? '#22c55e' : '#dc2626'
    }
  ];

  // Datos para proyección mensual
  const projectionData = monthlyProjection.map(item => ({
    ...item,
    month: item.month.replace('Mes ', 'M')
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number; payload?: { name?: string; percentage?: string } }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-slate-100">{label || data.payload?.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ${data.value?.toLocaleString()}
            {data.payload?.percentage && ` (${data.payload.percentage}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">Ingresos Totales</h3>
          <p className="text-3xl font-bold">${summary.totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">Gastos Totales</h3>
          <p className="text-3xl font-bold">${summary.totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`bg-gradient-to-r p-6 rounded-2xl text-white ${
          summary.balance >= 0 
            ? 'from-blue-500 to-blue-600' 
            : 'from-orange-500 to-orange-600'
        }`}>
          <h3 className="text-lg font-semibold mb-2">Balance</h3>
          <p className="text-3xl font-bold">
            {summary.balance >= 0 ? '+' : ''}${summary.balance.toLocaleString()}
          </p>
          <p className="text-sm opacity-90">
            Tasa de ahorro: {summary.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Comparación Ingresos vs Gastos */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Comparación Ingresos vs Gastos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis 
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución de Gastos */}
        {expenseData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Distribución de Gastos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell 
                      key={`expense-cell-${index}`} 
                      fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distribución de Ingresos */}
        {incomeData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Distribución de Ingresos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell 
                      key={`income-cell-${index}`} 
                      fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Proyección mensual */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Proyección de Balance (6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis 
              tick={{ fill: 'currentColor' }}
              className="text-slate-600 dark:text-slate-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="cumulativeBalance" 
              fill={summary.balance >= 0 ? '#10b981' : '#ef4444'}
              name="Balance Acumulado"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
