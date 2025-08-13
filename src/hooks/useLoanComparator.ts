"use client";
import { useState } from 'react';
import { compareLoans, LoanInput, LoanComparisonResult, UserContextInput } from '@/lib/calculations/loan';

export interface LoanFormState {
  loans: LoanInput[];
  user: UserContextInput;
}

const defaultLoans: LoanInput[] = [
  {
    id: 'loanA', name: 'Oferta A', amount: 150000, annualRate: 0.115, termMonths: 60,
    originationFeePct: 0.01, originationFeeFlat: 0, extraMonthlyPayment: 0
  },
  {
    id: 'loanB', name: 'Oferta B', amount: 150000, annualRate: 0.108, termMonths: 72,
    originationFeePct: 0, originationFeeFlat: 800, extraMonthlyPayment: 0
  }
];

const defaultUser: UserContextInput = {
  monthlyIncome: 8000,
  otherMonthlyDebt: 500
};

export function useLoanComparator() {
  const [form, setForm] = useState<LoanFormState>({ loans: defaultLoans, user: defaultUser });
  const [result, setResult] = useState<LoanComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = (): boolean => {
    const errs: Record<string,string> = {};
    form.loans.forEach((l: LoanInput, idx: number) => {
      if (l.amount <= 0) errs[`amount_${idx}`] = 'Monto > 0';
      if (l.annualRate < 0 || l.annualRate > 1) errs[`rate_${idx}`] = 'Tasa 0-1';
      if (l.termMonths <= 0) errs[`term_${idx}`] = 'Plazo > 0';
    });
    if (form.user.monthlyIncome <= 0) errs['monthlyIncome'] = 'Ingreso > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = compareLoans(form.loans, form.user);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const updateLoan = (id: string, patch: Partial<LoanInput>) => {
    setForm((prev: LoanFormState) => ({
      ...prev,
      loans: prev.loans.map((l: LoanInput) => l.id === id ? { ...l, ...patch } : l)
    }));
  };

  const addLoan = () => {
    const id = `loan${Math.random().toString(36).slice(2,7)}`;
    setForm((prev: LoanFormState) => ({
      ...prev,
      loans: [...prev.loans, { id, name: `Oferta ${String.fromCharCode(65+prev.loans.length)}`, amount: 100000, annualRate: 0.12, termMonths: 60, originationFeePct: 0, originationFeeFlat: 0, extraMonthlyPayment: 0 }]
    }));
  };

  const removeLoan = (id: string) => {
    setForm((prev: LoanFormState) => ({ ...prev, loans: prev.loans.filter((l: LoanInput) => l.id !== id) }));
  };

  const reset = () => {
    setForm({ loans: defaultLoans, user: defaultUser });
    setResult(null);
    setErrors({});
  };

  return { form, setForm, result, loading, errors, calculate, updateLoan, addLoan, removeLoan, reset };
}
