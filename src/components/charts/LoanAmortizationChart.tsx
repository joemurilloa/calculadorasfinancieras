"use client";
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AmortizationPoint } from '@/lib/calculations/loan';

export const LoanAmortizationChart: React.FC<{ data: AmortizationPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-sm text-slate-500">Sin datos de amortización.</div>;
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => v.toLocaleString(undefined,{style:'currency',currency:'USD'})} />
          <Legend />
          <Line type="monotone" dataKey="balance" name="Saldo" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="interest" name="Interés (mes)" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="principal" name="Capital (mes)" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
