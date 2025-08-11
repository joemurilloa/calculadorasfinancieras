"use client";
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { CashflowResult } from '@/hooks/useCashflowCalculator';

type Props = {
  result: CashflowResult;
};

export const CashflowChart: React.FC<Props> = ({ result }) => {
  const inflowData = result.breakdown.inflows.map((i) => ({
    name: i.name,
    Monto: i.amount,
    tipo: 'Ingreso',
  }));
  const outflowData = result.breakdown.outflows.map((i) => ({
    name: i.name,
    Monto: i.amount,
    tipo: 'Egreso',
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const p = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium mb-1">{label}</div>
          <div className="text-sm">{formatCurrency(p.value)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold mb-3">Ingresos por categoría</h4>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inflowData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="name" className="text-xs fill-slate-600 dark:fill-slate-400" />
              <YAxis className="text-xs fill-slate-600 dark:fill-slate-400" tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Monto" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Egresos por categoría</h4>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={outflowData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="name" className="text-xs fill-slate-600 dark:fill-slate-400" />
              <YAxis className="text-xs fill-slate-600 dark:fill-slate-400" tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Monto" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
