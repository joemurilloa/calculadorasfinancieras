// Tipos para la calculadora de presupuesto
export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  isEssential?: boolean; // Para gastos: esencial vs opcional
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number; // Porcentaje de ahorro
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  essentialExpenses: number;
  optionalExpenses: number;
}

export interface BudgetAnalysis {
  status: 'surplus' | 'deficit' | 'balanced';
  recommendations: string[];
  insights: string[];
  savingsGoal?: number;
  emergencyFundMonths?: number;
}

export interface BudgetResult {
  summary: BudgetSummary;
  analysis: BudgetAnalysis;
  monthlyProjection: {
    month: string;
    balance: number;
    cumulativeBalance: number;
  }[];
}

// Categorías predefinidas
export const INCOME_CATEGORIES = [
  'Salario Principal',
  'Salario Secundario',
  'Freelance/Consultoría',
  'Rentas/Alquileres',
  'Inversiones/Dividendos',
  'Pensión/Jubilación',
  'Negocios',
  'Otros Ingresos'
];

export const EXPENSE_CATEGORIES = [
  'Vivienda (Alquiler/Hipoteca)',
  'Servicios Básicos',
  'Alimentación',
  'Transporte',
  'Salud/Seguros',
  'Deudas/Préstamos',
  'Educación',
  'Entretenimiento',
  'Ropa/Calzado',
  'Ahorros/Inversiones',
  'Otros Gastos'
];

// Gastos considerados esenciales
export const ESSENTIAL_CATEGORIES = [
  'Vivienda (Alquiler/Hipoteca)',
  'Servicios Básicos',
  'Alimentación',
  'Transporte',
  'Salud/Seguros',
  'Deudas/Préstamos'
];

export function calculateBudget(items: BudgetItem[]): BudgetResult {
  const income = items.filter(item => item.type === 'income');
  const expenses = items.filter(item => item.type === 'expense');
  
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  
  // Agrupar por categorías
  const expensesByCategory = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const incomeByCategory = income.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Calcular gastos esenciales vs opcionales
  const essentialExpenses = expenses
    .filter(item => ESSENTIAL_CATEGORIES.includes(item.category) || item.isEssential)
    .reduce((sum, item) => sum + item.amount, 0);
  
  const optionalExpenses = totalExpenses - essentialExpenses;
  
  const summary: BudgetSummary = {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expensesByCategory,
    incomeByCategory,
    essentialExpenses,
    optionalExpenses
  };
  
  // Análisis y recomendaciones
  const analysis = generateBudgetAnalysis(summary);
  
  // Proyección mensual (6 meses)
  const monthlyProjection = generateMonthlyProjection(balance);
  
  return {
    summary,
    analysis,
    monthlyProjection
  };
}

function generateBudgetAnalysis(summary: BudgetSummary): BudgetAnalysis {
  const { balance, totalIncome, savingsRate, essentialExpenses, optionalExpenses } = summary;
  
  let status: 'surplus' | 'deficit' | 'balanced';
  if (balance > 0) {
    status = 'surplus';
  } else if (balance < 0) {
    status = 'deficit';
  } else {
    status = 'balanced';
  }
  
  const recommendations: string[] = [];
  const insights: string[] = [];
  
  // Análisis del balance
  if (status === 'deficit') {
    recommendations.push('🚨 Tienes un déficit mensual. Es urgente reducir gastos o aumentar ingresos.');
    recommendations.push('📋 Revisa los gastos opcionales y elimina los no esenciales.');
    
    if (optionalExpenses > Math.abs(balance)) {
      recommendations.push(`💡 Reduciendo ${Math.abs(balance).toLocaleString()} en gastos opcionales puedes equilibrar tu presupuesto.`);
    }
  } else if (status === 'surplus') {
    if (savingsRate >= 20) {
      insights.push('🎉 ¡Excelente! Tienes una tasa de ahorro superior al 20%.');
    } else if (savingsRate >= 10) {
      insights.push('👍 Buena tasa de ahorro. Considera aumentarla gradualmente.');
      recommendations.push('🎯 Intenta alcanzar una tasa de ahorro del 20% para mayor seguridad financiera.');
    } else {
      recommendations.push('📈 Tu tasa de ahorro es baja. Intenta ahorrar al menos el 10% de tus ingresos.');
    }
  }
  
  // Análisis de la distribución de gastos
  const housingPercentage = (summary.expensesByCategory['Vivienda (Alquiler/Hipoteca)'] || 0) / totalIncome * 100;
  if (housingPercentage > 30) {
    recommendations.push(`🏠 Tus gastos de vivienda (${housingPercentage.toFixed(1)}%) exceden el 30% recomendado de tus ingresos.`);
  }
  
  const essentialPercentage = (essentialExpenses / totalIncome) * 100;
  if (essentialPercentage > 70) {
    recommendations.push('⚠️ Tus gastos esenciales consumen más del 70% de tus ingresos. Busca formas de optimizarlos.');
  }
  
  // Recomendaciones específicas por categoría alta
  const expenseEntries = Object.entries(summary.expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (expenseEntries.length > 0) {
    insights.push(`💰 Tus mayores gastos son: ${expenseEntries.map(([cat, amount]) => 
      `${cat} ($${amount.toLocaleString()})`).join(', ')}.`);
  }
  
  // Consejos generales
  if (status !== 'deficit') {
    recommendations.push('🎯 Establece un fondo de emergencia equivalente a 3-6 meses de gastos.');
    recommendations.push('📊 Considera invertir tus ahorros para generar ingresos pasivos.');
  }
  
  const emergencyFundMonths = balance > 0 ? Math.floor(balance / (essentialExpenses || totalIncome * 0.7)) : 0;
  const savingsGoal = totalIncome * 0.2; // Meta del 20%
  
  return {
    status,
    recommendations,
    insights,
    savingsGoal,
    emergencyFundMonths
  };
}

function generateMonthlyProjection(monthlyBalance: number): BudgetResult['monthlyProjection'] {
  const months = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];
  let cumulativeBalance = 0;
  
  return months.map(month => {
    cumulativeBalance += monthlyBalance;
    return {
      month,
      balance: monthlyBalance,
      cumulativeBalance
    };
  });
}
