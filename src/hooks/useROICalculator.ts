"use client";
import { useState } from 'react';
import { 
  ROICalculator, 
  ROIResult as LibraryROIResult,
  InvestmentData as LibraryInvestmentData,
  ReturnsData as LibraryReturnsData,
  ParametersData as LibraryParametersData
} from '@/lib/calculations/roi';

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

  // Función para convertir del formato del hook al formato de la librería
  const convertToLibraryInput = (formData: ROIFormData) => {
    return {
      investment: {
        initialAmount: formData.investment.initial_amount,
        additionalCosts: formData.investment.additional_costs,
        investmentDate: formData.investment.investment_date
      } as LibraryInvestmentData,
      returns: {
        monthlyRevenueIncrease: formData.returns.monthly_revenue_increase,
        monthlyCostSavings: formData.returns.monthly_cost_savings,
        residualValue: formData.returns.residual_value
      } as LibraryReturnsData,
      parameters: {
        analysisPeriodMonths: formData.parameters.analysis_period_months,
        discountRate: formData.parameters.discount_rate,
        inflationRate: formData.parameters.inflation_rate
      } as LibraryParametersData
    };
  };

  // Función para convertir del resultado de la librería al formato del hook
  const convertFromLibraryResult = (result: LibraryROIResult): ROIResult => {
    return {
      metrics: {
        simple_roi: result.metrics.simpleRoi,
        annualized_roi: result.metrics.annualizedRoi,
        payback_period_months: result.metrics.paybackPeriodMonths,
        npv: result.metrics.npv,
        irr: result.metrics.irr,
        total_investment: result.investmentData.initialAmount + result.investmentData.additionalCosts,
        total_returns: result.returnsData.monthlyRevenueIncrease * result.parametersData.analysisPeriodMonths 
          + result.returnsData.monthlyCostSavings * result.parametersData.analysisPeriodMonths 
          + result.returnsData.residualValue,
        profit: result.metrics.npv
      },
      scenarios: result.scenarios.reduce((acc, scenario) => {
        acc[scenario.name] = {
          scenario_name: scenario.name,
          roi_percentage: scenario.roiPercentage,
          payback_months: scenario.paybackMonths,
          npv: scenario.npv,
          total_return: scenario.npv
        };
        return acc;
      }, {} as Record<string, ROIScenario>),
      timeline: result.timeline.map(item => ({
        month: item.month,
        cumulative_cash_flow: item.cumulative,
        monthly_return: item.cashFlow,
        net_present_value: item.npv,
        payback_achieved: item.cumulative >= 0
      })),
      analysis: {
        recommendation: result.analysis.recommendation,
        risk_level: result.analysis.riskLevel === 'Bajo' ? 'low' : 
                   result.analysis.riskLevel === 'Medio' ? 'medium' : 'high',
        key_insights: result.analysis.keyFactors,
        investment_grade: result.analysis.investmentGrade === 'Excelente' ? 'excellent' :
                          result.analysis.investmentGrade === 'Buena' ? 'good' :
                          result.analysis.investmentGrade === 'Regular' ? 'fair' : 'poor'
      }
    };
  };

  const calculateROI = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Convertir formato y usar librería local
      const libraryInput = convertToLibraryInput(formData);
      const libraryResult = ROICalculator.calculate(
        libraryInput.investment,
        libraryInput.returns,
        libraryInput.parameters
      );
      const adaptedResult = convertFromLibraryResult(libraryResult);
      setResult(adaptedResult);
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
