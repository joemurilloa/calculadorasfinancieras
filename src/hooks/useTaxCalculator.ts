import { useState, useCallback } from 'react';
import { TaxCalculator, TaxInput, TaxResult } from '@/lib/calculations/tax';

export interface TaxFormData extends TaxInput {
  // Campos adicionales para el formulario
  name: string;
  rfc: string;
  email: string;
}

const initialFormData: TaxFormData = {
  // Información del contribuyente
  taxpayerType: 'individual',
  regime: 'simplified',
  name: '',
  rfc: '',
  email: '',
  
  // Ingresos
  monthlyIncome: 0,
  annualIncome: 0,
  
  // Gastos y deducciones
  businessExpenses: 0,
  personalDeductions: 0,
  medicalExpenses: 0,
  educationalExpenses: 0,
  mortgageInterest: 0,
  donations: 0,
  
  // IVA
  vatRate: 0.16,
  vatCollected: 0,
  vatPaid: 0,
  
  // Retenciones
  withholdingTax: 0,
  isrWithholding: 0,
  
  // Otros
  otherIncome: 0,
  otherDeductions: 0,
};

export const useTaxCalculator = () => {
  const [formData, setFormData] = useState<TaxFormData>(initialFormData);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((data: TaxFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Validaciones básicas
    if (!data.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!data.rfc.trim()) {
      newErrors.rfc = 'El RFC es requerido';
    } else if (!/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(data.rfc.toUpperCase())) {
      newErrors.rfc = 'El RFC no tiene un formato válido';
    }

    if (data.monthlyIncome <= 0) {
      newErrors.monthlyIncome = 'El ingreso mensual debe ser mayor a 0';
    }

    if (data.annualIncome <= 0) {
      newErrors.annualIncome = 'El ingreso anual debe ser mayor a 0';
    }

    // Validar que los gastos no sean negativos
    if (data.businessExpenses < 0) {
      newErrors.businessExpenses = 'Los gastos de negocio no pueden ser negativos';
    }

    if (data.medicalExpenses < 0) {
      newErrors.medicalExpenses = 'Los gastos médicos no pueden ser negativos';
    }

    if (data.educationalExpenses < 0) {
      newErrors.educationalExpenses = 'Los gastos educativos no pueden ser negativos';
    }

    if (data.mortgageInterest < 0) {
      newErrors.mortgageInterest = 'Los intereses hipotecarios no pueden ser negativos';
    }

    if (data.donations < 0) {
      newErrors.donations = 'Las donaciones no pueden ser negativas';
    }

    // Validar IVA
    if (data.vatRate < 0 || data.vatRate > 1) {
      newErrors.vatRate = 'La tasa de IVA debe estar entre 0 y 1';
    }

    if (data.vatCollected < 0) {
      newErrors.vatCollected = 'El IVA cobrado no puede ser negativo';
    }

    if (data.vatPaid < 0) {
      newErrors.vatPaid = 'El IVA pagado no puede ser negativo';
    }

    return newErrors;
  }, []);

  const handleInputChange = useCallback((field: keyof TaxFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const calculateTaxes = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validar formulario
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calcular impuestos
      const taxResult = TaxCalculator.calculate(formData);
      setResult(taxResult);

    } catch (error) {
      console.error('Error calculando impuestos:', error);
      setErrors({ general: 'Error al calcular los impuestos. Por favor, verifica los datos.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const resetCalculator = useCallback(() => {
    setFormData(initialFormData);
    setResult(null);
    setErrors({});
  }, []);

  const updateField = useCallback((field: keyof TaxFormData, value: string | number) => {
    handleInputChange(field, value);
  }, [handleInputChange]);

  const setForm = useCallback((newFormData: Partial<TaxFormData>) => {
    setFormData(prev => ({ ...prev, ...newFormData }));
  }, []);

  return {
    formData,
    result,
    isLoading,
    errors,
    calculateTaxes,
    resetCalculator,
    handleInputChange,
    updateField,
    setForm,
  };
};
