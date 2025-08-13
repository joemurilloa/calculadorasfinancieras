import { useState, useCallback } from 'react';
import { 
  BudgetItem, 
  BudgetResult, 
  calculateBudget,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES
} from '@/lib/calculations/budget';

interface BudgetForm {
  items: BudgetItem[];
}

interface BudgetErrors {
  [key: string]: string;
}

export const useBudgetCalculator = () => {
  const [form, setForm] = useState<BudgetForm>({
    items: []
  });
  
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<BudgetErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: BudgetErrors = {};
    
    if (form.items.length === 0) {
      newErrors.general = 'Agrega al menos un ingreso o gasto para calcular tu presupuesto.';
      setErrors(newErrors);
      return false;
    }
    
    // Validar cada item
    form.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`name_${index}`] = 'El nombre es requerido.';
      }
      if (item.amount <= 0) {
        newErrors[`amount_${index}`] = 'El monto debe ser mayor a 0.';
      }
      if (!item.category) {
        newErrors[`category_${index}`] = 'Selecciona una categoría.';
      }
    });
    
    const hasIncome = form.items.some(item => item.type === 'income');
    if (!hasIncome) {
      newErrors.general = 'Agrega al menos un ingreso para calcular tu presupuesto.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const calculate = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simular tiempo de cálculo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const calculationResult = calculateBudget(form.items);
      setResult(calculationResult);
      setErrors({});
    } catch (error) {
      console.error('Error calculating budget:', error);
      setErrors({ general: 'Error al calcular el presupuesto. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  }, [form, validateForm]);

  const addItem = useCallback((type: 'income' | 'expense') => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: 0,
      category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
      type,
      isEssential: type === 'expense' ? true : undefined
    };
    
    setForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<BudgetItem>) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  const reset = useCallback(() => {
    setForm({ items: [] });
    setResult(null);
    setErrors({});
  }, []);

  const duplicateItem = useCallback((id: string) => {
    const itemToDuplicate = form.items.find(item => item.id === id);
    if (itemToDuplicate) {
      const duplicatedItem: BudgetItem = {
        ...itemToDuplicate,
        id: Math.random().toString(36).substr(2, 9),
        name: `${itemToDuplicate.name} (copia)`
      };
      
      setForm(prev => ({
        ...prev,
        items: [...prev.items, duplicatedItem]
      }));
    }
  }, [form.items]);

  return {
    form,
    setForm,
    result,
    loading,
    errors,
    calculate,
    addItem,
    updateItem,
    removeItem,
    reset,
    duplicateItem,
    incomeCategories: INCOME_CATEGORIES,
    expenseCategories: EXPENSE_CATEGORIES
  };
};
