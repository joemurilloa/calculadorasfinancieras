"use client";
import { useState } from 'react';

export interface InvestmentData {
  initial_amount: number;
  additional_costs: number;
  investment_date: string;
}

export interface ReturnsData {
  monthly_revenue_increase: number;
  monthly_cost_savings: number;
  residual_value: number;
}

export interface ParametersData {
  analysis_period_months: number;
  discount_rate: number;
  inflation_rate: number;
}

export interface ROIFormData {
  investment: InvestmentData;
  returns: ReturnsData;
  parameters: ParametersData;
}

export interface MonthlyProjection {
  month: number;
  cumulative_cash_flow: number;
  monthly_return: number;
  net_present_value: number;
  payback_achieved: boolean;
}

export interface ROIScenario {
  scenario_name: string;
  roi_percentage: number;
  payback_months: number | null;
  npv: number;
  total_return: number;
}

export interface ROIMetrics {
  simple_roi: number;
  annualized_roi: number;
  payback_period_months: number | null;
  npv: number;
  irr: number | null;
  total_investment: number;
  total_returns: number;
  profit: number;
}

export interface ROIAnalysis {
  recommendation: string;
  risk_level: 'low' | 'medium' | 'high';
  key_insights: string[];
  investment_grade: 'excellent' | 'good' | 'fair' | 'poor' | 'avoid';
}

export interface ROIResult {
  metrics: ROIMetrics;
  scenarios: Record<string, ROIScenario>;
  timeline: MonthlyProjection[];
  analysis: ROIAnalysis;
}

const initialFormData: ROIFormData = {
  investment: {
    initial_amount: 25000,
    additional_costs: 2500,
    investment_date: new Date().toISOString().split('T')[0]
  },
  returns: {
    monthly_revenue_increase: 4500,
    monthly_cost_savings: 1200,
    residual_value: 5000
  },
  parameters: {
    analysis_period_months: 24,
    discount_rate: 0.12,
    inflation_rate: 0.04
  }
};

export const useROICalculator = () => {
  const [formData, setFormData] = useState<ROIFormData>(initialFormData);
  const [result, setResult] = useState<ROIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Investment validation
    if (formData.investment.initial_amount <= 0) {
      newErrors['initial_amount'] = 'La inversión inicial debe ser mayor a 0';
    }
    if (formData.investment.additional_costs < 0) {
      newErrors['additional_costs'] = 'Los costos adicionales no pueden ser negativos';
    }
    if (!formData.investment.investment_date) {
      newErrors['investment_date'] = 'La fecha de inversión es requerida';
    }

    // Returns validation
    if (formData.returns.monthly_revenue_increase < 0) {
      newErrors['monthly_revenue_increase'] = 'El aumento de ingresos no puede ser negativo';
    }
    if (formData.returns.monthly_cost_savings < 0) {
      newErrors['monthly_cost_savings'] = 'El ahorro en costos no puede ser negativo';
    }
    if (formData.returns.residual_value < 0) {
      newErrors['residual_value'] = 'El valor residual no puede ser negativo';
    }

    // Check if there are any returns
    const totalMonthlyReturns = formData.returns.monthly_revenue_increase + formData.returns.monthly_cost_savings;
    if (totalMonthlyReturns === 0 && formData.returns.residual_value === 0) {
      newErrors['returns'] = 'Debe especificar al menos un tipo de retorno (ingresos, ahorros o valor residual)';
    }

    // Parameters validation
    if (formData.parameters.analysis_period_months < 1 || formData.parameters.analysis_period_months > 120) {
      newErrors['analysis_period_months'] = 'El período de análisis debe estar entre 1 y 120 meses';
    }
    if (formData.parameters.discount_rate < 0 || formData.parameters.discount_rate > 1) {
      newErrors['discount_rate'] = 'La tasa de descuento debe estar entre 0% y 100%';
    }
    if (formData.parameters.inflation_rate < 0 || formData.parameters.inflation_rate > 1) {
      newErrors['inflation_rate'] = 'La tasa de inflación debe estar entre 0% y 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateROI = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/v1/roi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          round_to: 2
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al calcular ROI');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calculando ROI:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Error desconocido al calcular ROI'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInvestment = (field: keyof InvestmentData, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        [field]: value
      }
    }));
    // Clear related errors
    if (errors[field]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const updateReturns = (field: keyof ReturnsData, value: number) => {
    setFormData(prev => ({
      ...prev,
      returns: {
        ...prev.returns,
        [field]: value
      }
    }));
    // Clear related errors
    if (errors[field]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const updateParameters = (field: keyof ParametersData, value: number) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [field]: value
      }
    }));
    // Clear related errors
    if (errors[field]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResult(null);
    setErrors({});
  };

  const clearResults = () => {
    setResult(null);
  };

  return {
    formData,
    result,
    loading,
    errors,
    calculateROI,
    updateInvestment,
    updateReturns,
    updateParameters,
    resetForm,
    clearResults,
    validateForm
  };
};
