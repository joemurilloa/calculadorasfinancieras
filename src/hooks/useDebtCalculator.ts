import { useState, useCallback } from 'react';
import { DebtCalculator, Debt, DebtPaymentPlan, DebtAnalysis } from '@/lib/calculations/debt';

export interface DebtFormData {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'personal_loan' | 'mortgage' | 'car_loan' | 'student_loan' | 'other';
}

export const useDebtCalculator = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball' | 'custom'>('avalanche');
  const [customPriorities, setCustomPriorities] = useState<{ [debtId: string]: number }>({});
  
  const [analysis, setAnalysis] = useState<DebtAnalysis | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<DebtPaymentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDebt = useCallback((debt: DebtFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!debt.name.trim()) {
      newErrors.name = 'El nombre de la deuda es requerido';
    }

    if (debt.balance <= 0) {
      newErrors.balance = 'El saldo debe ser mayor a 0';
    }

    if (debt.interestRate < 0 || debt.interestRate > 100) {
      newErrors.interestRate = 'La tasa de interés debe estar entre 0 y 100%';
    }

    if (debt.minimumPayment <= 0) {
      newErrors.minimumPayment = 'El pago mínimo debe ser mayor a 0';
    }

    if (debt.minimumPayment > debt.balance) {
      newErrors.minimumPayment = 'El pago mínimo no puede ser mayor al saldo';
    }

    return newErrors;
  }, []);

  const addDebt = useCallback((debtData: DebtFormData) => {
    const validationErrors = validateDebt(debtData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      name: debtData.name,
      balance: debtData.balance,
      interestRate: debtData.interestRate,
      minimumPayment: debtData.minimumPayment,
      type: debtData.type
    };

    setDebts(prev => [...prev, newDebt]);
    setErrors({});
    return true;
  }, [validateDebt]);

  const updateDebt = useCallback((debtId: string, updates: Partial<DebtFormData>) => {
    setDebts(prev => prev.map(debt => 
      debt.id === debtId ? { ...debt, ...updates } : debt
    ));
  }, []);

  const removeDebt = useCallback((debtId: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== debtId));
    setCustomPriorities(prev => {
      const newPriorities = { ...prev };
      delete newPriorities[debtId];
      return newPriorities;
    });
  }, []);

  const calculatePaymentPlan = useCallback(async () => {
    if (debts.length === 0) {
      setErrors({ general: 'Agrega al menos una deuda para calcular el plan de pagos' });
      return;
    }

    if (monthlyIncome <= 0) {
      setErrors({ general: 'Ingresa tu ingreso mensual para calcular el plan' });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Analizar deudas
      const debtAnalysis = DebtCalculator.analyzeDebts(debts, monthlyIncome);
      setAnalysis(debtAnalysis);

      // Calcular plan de pagos según estrategia seleccionada
      let plan: DebtPaymentPlan;
      
      if (selectedStrategy === 'avalanche') {
        plan = DebtCalculator.calculateAvalancheStrategy(debts, extraPayment);
      } else if (selectedStrategy === 'snowball') {
        plan = DebtCalculator.calculateSnowballStrategy(debts, extraPayment);
      } else {
        plan = DebtCalculator.calculateCustomStrategy(debts, extraPayment, monthlyIncome, customPriorities);
      }

      setPaymentPlan(plan);

    } catch (error) {
      console.error('Error calculando plan de pagos:', error);
      setErrors({ general: 'Error al calcular el plan de pagos. Verifica los datos.' });
    } finally {
      setIsLoading(false);
    }
  }, [debts, monthlyIncome, extraPayment, selectedStrategy, customPriorities]);

  const updateCustomPriority = useCallback((debtId: string, priority: number) => {
    setCustomPriorities(prev => ({
      ...prev,
      [debtId]: priority
    }));
  }, []);

  const resetCalculator = useCallback(() => {
    setDebts([]);
    setMonthlyIncome(0);
    setExtraPayment(0);
    setSelectedStrategy('avalanche');
    setCustomPriorities({});
    setAnalysis(null);
    setPaymentPlan(null);
    setErrors({});
  }, []);

  const getDebtById = useCallback((debtId: string) => {
    return debts.find(debt => debt.id === debtId);
  }, [debts]);

  const getTotalDebt = useCallback(() => {
    return debts.reduce((sum, debt) => sum + debt.balance, 0);
  }, [debts]);

  const getTotalMinimumPayments = useCallback(() => {
    return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  }, [debts]);

  const getDebtToIncomeRatio = useCallback(() => {
    if (monthlyIncome <= 0) return 0;
    return getTotalDebt() / monthlyIncome;
  }, [monthlyIncome, getTotalDebt]);

  const canAffordExtraPayment = useCallback(() => {
    const totalMinimumPayments = getTotalMinimumPayments();
    const availableIncome = monthlyIncome - totalMinimumPayments;
    return availableIncome >= extraPayment;
  }, [monthlyIncome, getTotalMinimumPayments, extraPayment]);

  return {
    // Estado
    debts,
    monthlyIncome,
    extraPayment,
    selectedStrategy,
    customPriorities,
    analysis,
    paymentPlan,
    isLoading,
    errors,
    
    // Acciones
    addDebt,
    updateDebt,
    removeDebt,
    calculatePaymentPlan,
    updateCustomPriority,
    resetCalculator,
    
    // Setters
    setMonthlyIncome,
    setExtraPayment,
    setSelectedStrategy,
    
    // Utilidades
    getDebtById,
    getTotalDebt,
    getTotalMinimumPayments,
    getDebtToIncomeRatio,
    canAffordExtraPayment,
    
    // Validación
    validateDebt
  };
};
