'use client';

import { useState } from 'react';

export interface BreakevenFormData {
  fixedCosts: number;
  unitPrice: number;
  variableCost: number;
  currentSales: number;
}

export interface BreakevenResult {
  breakevenUnits: number;
  breakevenRevenue: number;
  contributionMarginPerUnit: number;
  contributionMarginPercentage: number;
  safetyMarginUnits: number | null;
  safetyMarginPercentage: number | null;
  chartData: Array<{
    units: number;
    revenue: number;
    totalCosts: number;
    fixedCosts: number;
    variableCosts: number;
    profit: number;
  }>;
}

export interface BreakevenErrors {
  fixedCosts?: string;
  unitPrice?: string;
  variableCost?: string;
  currentSales?: string;
  general?: string;
}

export const useBreakevenCalculator = () => {
  const [formData, setFormData] = useState<BreakevenFormData>({
    fixedCosts: 0,
    unitPrice: 0,
    variableCost: 0,
    currentSales: 0
  });

  const [result, setResult] = useState<BreakevenResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<BreakevenErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof BreakevenErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: BreakevenErrors = {};

    if (!formData.fixedCosts || formData.fixedCosts <= 0) {
      newErrors.fixedCosts = 'Los costos fijos deben ser mayor a 0';
    }

    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = 'El precio de venta debe ser mayor a 0';
    }

    if (formData.variableCost < 0) {
      newErrors.variableCost = 'El costo variable no puede ser negativo';
    }

    if (formData.variableCost >= formData.unitPrice && formData.unitPrice > 0) {
      newErrors.general = 'El costo variable debe ser menor al precio de venta';
    }

    if (formData.currentSales < 0) {
      newErrors.currentSales = 'Las ventas actuales no pueden ser negativas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBreakeven = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const contributionMarginPerUnit = formData.unitPrice - formData.variableCost;
      const contributionMarginPercentage = (contributionMarginPerUnit / formData.unitPrice) * 100;
      
      const breakevenUnits = formData.fixedCosts / contributionMarginPerUnit;
      const breakevenRevenue = breakevenUnits * formData.unitPrice;
      
      // Safety margin calculations (only if current sales provided)
      let safetyMarginUnits: number | null = null;
      let safetyMarginPercentage: number | null = null;
      
      if (formData.currentSales > 0) {
        safetyMarginUnits = formData.currentSales - breakevenUnits;
        safetyMarginPercentage = (safetyMarginUnits / formData.currentSales) * 100;
      }
      
      // Generate chart data
      const maxUnits = Math.max(breakevenUnits * 2, formData.currentSales * 1.5, 1000);
      const chartData = [];
      
      for (let units = 0; units <= maxUnits; units += maxUnits / 20) {
        const revenue = units * formData.unitPrice;
        const variableCosts = units * formData.variableCost;
        const totalCosts = formData.fixedCosts + variableCosts;
        const profit = revenue - totalCosts;
        
        chartData.push({
          units: Math.round(units),
          revenue,
          totalCosts,
          fixedCosts: formData.fixedCosts,
          variableCosts,
          profit
        });
      }

      const breakevenResult: BreakevenResult = {
        breakevenUnits,
        breakevenRevenue,
        contributionMarginPerUnit,
        contributionMarginPercentage,
        safetyMarginUnits,
        safetyMarginPercentage,
        chartData
      };

      setResult(breakevenResult);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);

    } catch (error) {
      console.error('Error calculating breakeven:', error);
      setErrors({ general: 'Error al calcular el punto de equilibrio' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetCalculator = () => {
    setFormData({
      fixedCosts: 0,
      unitPrice: 0,
      variableCost: 0,
      currentSales: 0
    });
    setResult(null);
    setErrors({});
  };

  return {
    formData,
    result,
    isLoading,
    errors,
    handleInputChange,
    calculateBreakeven,
    resetCalculator
  };
};
