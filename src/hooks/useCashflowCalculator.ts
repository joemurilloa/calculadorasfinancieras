import { useCallback, useMemo, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

export type CashItem = { name: string; amount: number };

export interface CashflowForm {
  starting_cash: number;
  revenue: CashItem[];
  other_inflows: CashItem[];
  cogs: CashItem[];
  opex_fixed: CashItem[];
  opex_variable: CashItem[];
  payroll: CashItem[];
  loan_interest: CashItem[];
  loan_principal: CashItem[];
  capex: CashItem[];
  other_outflows: CashItem[];
  tax_rate: number; // 0..1
  round_to: number; // 0..6
}

export interface CashflowResult {
  totals: {
    total_inflows: number;
    total_outflows: number;
    taxes_cash: number;
    operating_cash_flow: number;
    free_cash_flow: number;
    net_cash_flow: number;
    ending_cash: number;
    burn_rate: number;
    runway_months?: number | null;
  };
  breakdown: {
    inflows: CashItem[];
    outflows: CashItem[];
  };
  analysis: {
    summary: string;
    risk_level: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
}

const emptyItem = (): CashItem => ({ name: '', amount: 0 });

export const useCashflowCalculator = () => {
  const [form, setForm] = useState<CashflowForm>({
    starting_cash: 10000,
    revenue: [
      { name: 'Ventas productos', amount: 15000 },
      { name: 'Servicios', amount: 5000 }
    ],
    other_inflows: [],
    cogs: [
      { name: 'Materia prima', amount: 4000 }
    ],
    opex_fixed: [
      { name: 'Renta oficina', amount: 2000 },
      { name: 'Seguros', amount: 500 }
    ],
    opex_variable: [
      { name: 'Marketing', amount: 1500 }
    ],
    payroll: [
      { name: 'Sueldos empleados', amount: 8000 }
    ],
    loan_interest: [],
    loan_principal: [],
    capex: [],
    other_outflows: [],
    tax_rate: 0.15,
    round_to: 2,
  });

  const [result, setResult] = useState<CashflowResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValid = useMemo(() => {
    const e: Record<string, string> = {};
    if (form.starting_cash < 0) e.starting_cash = 'La caja inicial no puede ser negativa';
    
    // Verificar que al menos hay ingresos con valores > 0
    const hasValidRevenue = form.revenue.some(item => item.name.trim() && item.amount > 0);
    if (!hasValidRevenue) e.revenue = 'Agrega al menos un ingreso válido (nombre y monto > 0)';
    
    if (form.tax_rate < 0 || form.tax_rate > 1) e.tax_rate = 'El impuesto debe estar entre 0 y 1';
    if (form.round_to < 0 || form.round_to > 6) e.round_to = 'Redondeo entre 0 y 6';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const addItem = useCallback((key: keyof CashflowForm) => {
    setForm(prev => ({
      ...prev,
      [key]: [...(prev[key] as CashItem[]), emptyItem()],
    }));
  }, []);

  const removeItem = useCallback((key: keyof CashflowForm, idx: number) => {
    setForm(prev => ({
      ...prev,
      [key]: (prev[key] as CashItem[]).filter((_, i) => i !== idx),
    }));
  }, []);

  const updateItem = useCallback((key: keyof CashflowForm, idx: number, patch: Partial<CashItem>) => {
    setForm(prev => ({
      ...prev,
      [key]: (prev[key] as CashItem[]).map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  }, []);

  const calculate = useCallback(async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/cashflow/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CashflowResult = await res.json();
      setResult(data);
      setTimeout(() => {
        document.getElementById('cashflow-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [form, isValid]);

  const reset = useCallback(() => {
    setForm({
      starting_cash: 10000,
      revenue: [
        { name: 'Ventas productos', amount: 15000 },
        { name: 'Servicios', amount: 5000 }
      ],
      other_inflows: [],
      cogs: [
        { name: 'Materia prima', amount: 4000 }
      ],
      opex_fixed: [
        { name: 'Renta oficina', amount: 2000 },
        { name: 'Seguros', amount: 500 }
      ],
      opex_variable: [
        { name: 'Marketing', amount: 1500 }
      ],
      payroll: [
        { name: 'Sueldos empleados', amount: 8000 }
      ],
      loan_interest: [],
      loan_principal: [],
      capex: [],
      other_outflows: [],
      tax_rate: 0.15,
      round_to: 2,
    });
    setResult(null);
    setErrors({});
  }, []);

  return {
    form,
    setForm,
    result,
    isLoading,
    errors,
    addItem,
    removeItem,
    updateItem,
    calculate,
    reset,
  };
};
