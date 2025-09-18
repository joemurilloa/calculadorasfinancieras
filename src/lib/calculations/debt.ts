// Librería de cálculos para gestión de deudas
export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  type: 'credit_card' | 'personal_loan' | 'mortgage' | 'car_loan' | 'student_loan' | 'other';
  priority?: number;
}

export interface DebtPaymentPlan {
  strategy: 'avalanche' | 'snowball' | 'custom';
  totalDebt: number;
  totalInterest: number;
  totalPayments: number;
  monthsToFreedom: number;
  monthlyPayment: number;
  extraPayment: number;
  savings: number;
  payments: DebtPayment[];
  explanation: string;
  tips: string[];
}

export interface DebtPayment {
  month: number;
  debtId: string;
  debtName: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  isPaidOff: boolean;
}

export interface DebtAnalysis {
  totalDebt: number;
  totalMinimumPayments: number;
  averageInterestRate: number;
  highestInterestRate: number;
  lowestBalance: number;
  highestBalance: number;
  debtToIncomeRatio: number;
  recommendedStrategy: 'avalanche' | 'snowball' | 'custom';
  reasoning: string;
}

export class DebtCalculator {
  static analyzeDebts(debts: Debt[], monthlyIncome: number): DebtAnalysis {
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const averageInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length;
    const highestInterestRate = Math.max(...debts.map(d => d.interestRate));
    const lowestBalance = Math.min(...debts.map(d => d.balance));
    const highestBalance = Math.max(...debts.map(d => d.balance));
    const debtToIncomeRatio = totalDebt / monthlyIncome;

    // Determinar estrategia recomendada
    let recommendedStrategy: 'avalanche' | 'snowball' | 'custom';
    let reasoning: string;

    if (debts.length === 1) {
      recommendedStrategy = 'custom';
      reasoning = 'Solo tienes una deuda. Enfócate en pagarla lo más rápido posible.';
    } else if (highestInterestRate - averageInterestRate > 5) {
      recommendedStrategy = 'avalanche';
      reasoning = 'Tienes una deuda con tasa de interés muy alta. El método avalancha te ahorrará más dinero.';
    } else if (lowestBalance < totalDebt * 0.2) {
      recommendedStrategy = 'snowball';
      reasoning = 'Tienes deudas pequeñas que puedes pagar rápido. El método bola de nieve te dará motivación.';
    } else {
      recommendedStrategy = 'avalanche';
      reasoning = 'El método avalancha te ahorrará más dinero a largo plazo.';
    }

    return {
      totalDebt,
      totalMinimumPayments,
      averageInterestRate,
      highestInterestRate,
      lowestBalance,
      highestBalance,
      debtToIncomeRatio,
      recommendedStrategy,
      reasoning
    };
  }

  static calculateAvalancheStrategy(
    debts: Debt[], 
    extraPayment: number
  ): DebtPaymentPlan {
    // Ordenar deudas por tasa de interés (mayor a menor)
    const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalMonthlyPayment = totalMinimumPayments + extraPayment;
    
    const payments: DebtPayment[] = [];
    let month = 1;
    let totalInterest = 0;
    let currentDebts = sortedDebts.map(debt => ({ ...debt, remainingBalance: debt.balance }));
    
    while (currentDebts.some(debt => debt.remainingBalance > 0)) {
      // Calcular pagos para cada deuda
      for (const debt of currentDebts) {
        if (debt.remainingBalance <= 0) continue;
        
        const monthlyRate = debt.interestRate / 100 / 12;
        const interestPayment = debt.remainingBalance * monthlyRate;
        const minimumPayment = debt.minimumPayment;
        
        // Si es la deuda con mayor interés, agregar el pago extra
        const isHighestInterest = debt.id === sortedDebts[0].id;
        const extraForThisDebt = isHighestInterest ? extraPayment : 0;
        const totalPayment = Math.min(minimumPayment + extraForThisDebt, debt.remainingBalance + interestPayment);
        
        const principalPayment = Math.max(0, totalPayment - interestPayment);
        const newBalance = Math.max(0, debt.remainingBalance - principalPayment);
        
        payments.push({
          month,
          debtId: debt.id,
          debtName: debt.name,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: newBalance,
          isPaidOff: newBalance <= 0
        });
        
        debt.remainingBalance = newBalance;
        totalInterest += interestPayment;
      }
      
      // Remover deudas pagadas
      currentDebts = currentDebts.filter(debt => debt.remainingBalance > 0);
      month++;
      
      // Prevenir bucle infinito
      if (month > 600) break;
    }
    
    const monthsToFreedom = month - 1;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.payment, 0);
    const savings = this.calculateSavings(debts, totalPayments);
    
    return {
      strategy: 'avalanche',
      totalDebt,
      totalInterest,
      totalPayments,
      monthsToFreedom,
      monthlyPayment: totalMonthlyPayment,
      extraPayment,
      savings,
      payments,
      explanation: this.generateAvalancheExplanation(debts, monthsToFreedom, savings),
      tips: this.generateAvalancheTips()
    };
  }

  static calculateSnowballStrategy(
    debts: Debt[], 
    extraPayment: number
  ): DebtPaymentPlan {
    // Ordenar deudas por balance (menor a mayor)
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalMonthlyPayment = totalMinimumPayments + extraPayment;
    
    const payments: DebtPayment[] = [];
    let month = 1;
    let totalInterest = 0;
    let currentDebts = sortedDebts.map(debt => ({ ...debt, remainingBalance: debt.balance }));
    let availableExtra = extraPayment;
    
    while (currentDebts.some(debt => debt.remainingBalance > 0)) {
      // Calcular pagos para cada deuda
      for (const debt of currentDebts) {
        if (debt.remainingBalance <= 0) continue;
        
        const monthlyRate = debt.interestRate / 100 / 12;
        const interestPayment = debt.remainingBalance * monthlyRate;
        const minimumPayment = debt.minimumPayment;
        
        // Si es la deuda más pequeña, agregar el pago extra disponible
        const isSmallestDebt = debt.id === sortedDebts[0].id;
        const extraForThisDebt = isSmallestDebt ? availableExtra : 0;
        const totalPayment = Math.min(minimumPayment + extraForThisDebt, debt.remainingBalance + interestPayment);
        
        const principalPayment = Math.max(0, totalPayment - interestPayment);
        const newBalance = Math.max(0, debt.remainingBalance - principalPayment);
        
        payments.push({
          month,
          debtId: debt.id,
          debtName: debt.name,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: newBalance,
          isPaidOff: newBalance <= 0
        });
        
        debt.remainingBalance = newBalance;
        totalInterest += interestPayment;
        
        // Si la deuda se pagó, liberar el pago mínimo para la siguiente
        if (newBalance <= 0 && isSmallestDebt) {
          availableExtra += minimumPayment;
          // Remover deuda pagada y actualizar la siguiente más pequeña
          currentDebts = currentDebts.filter(d => d.remainingBalance > 0);
          if (currentDebts.length > 0) {
            sortedDebts.shift();
          }
        }
      }
      
      // Remover deudas pagadas
      currentDebts = currentDebts.filter(debt => debt.remainingBalance > 0);
      month++;
      
      // Prevenir bucle infinito
      if (month > 600) break;
    }
    
    const monthsToFreedom = month - 1;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.payment, 0);
    const savings = this.calculateSavings(debts, totalPayments);
    
    return {
      strategy: 'snowball',
      totalDebt,
      totalInterest,
      totalPayments,
      monthsToFreedom,
      monthlyPayment: totalMonthlyPayment,
      extraPayment,
      savings,
      payments,
      explanation: this.generateSnowballExplanation(debts, monthsToFreedom),
      tips: this.generateSnowballTips()
    };
  }

  static calculateCustomStrategy(
    debts: Debt[], 
    extraPayment: number, 
    monthlyIncome: number,
    customPriorities: { [debtId: string]: number }
  ): DebtPaymentPlan {
    // Ordenar deudas por prioridad personalizada
    const sortedDebts = [...debts].sort((a, b) => (customPriorities[a.id] || 0) - (customPriorities[b.id] || 0));
    
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalMonthlyPayment = totalMinimumPayments + extraPayment;
    
    const payments: DebtPayment[] = [];
    let month = 1;
    let totalInterest = 0;
    let currentDebts = sortedDebts.map(debt => ({ ...debt, remainingBalance: debt.balance }));
    let availableExtra = extraPayment;
    
    while (currentDebts.some(debt => debt.remainingBalance > 0)) {
      // Calcular pagos para cada deuda
      for (const debt of currentDebts) {
        if (debt.remainingBalance <= 0) continue;
        
        const monthlyRate = debt.interestRate / 100 / 12;
        const interestPayment = debt.remainingBalance * monthlyRate;
        const minimumPayment = debt.minimumPayment;
        
        // Si es la deuda con mayor prioridad, agregar el pago extra disponible
        const isHighestPriority = debt.id === sortedDebts[0].id;
        const extraForThisDebt = isHighestPriority ? availableExtra : 0;
        const totalPayment = Math.min(minimumPayment + extraForThisDebt, debt.remainingBalance + interestPayment);
        
        const principalPayment = Math.max(0, totalPayment - interestPayment);
        const newBalance = Math.max(0, debt.remainingBalance - principalPayment);
        
        payments.push({
          month,
          debtId: debt.id,
          debtName: debt.name,
          payment: totalPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: newBalance,
          isPaidOff: newBalance <= 0
        });
        
        debt.remainingBalance = newBalance;
        totalInterest += interestPayment;
        
        // Si la deuda se pagó, liberar el pago mínimo para la siguiente
        if (newBalance <= 0 && isHighestPriority) {
          availableExtra += minimumPayment;
          // Remover deuda pagada y actualizar la siguiente con mayor prioridad
          currentDebts = currentDebts.filter(d => d.remainingBalance > 0);
          if (currentDebts.length > 0) {
            sortedDebts.shift();
          }
        }
      }
      
      // Remover deudas pagadas
      currentDebts = currentDebts.filter(debt => debt.remainingBalance > 0);
      month++;
      
      // Prevenir bucle infinito
      if (month > 600) break;
    }
    
    const monthsToFreedom = month - 1;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.payment, 0);
    const savings = this.calculateSavings(debts, totalPayments);
    
    return {
      strategy: 'custom',
      totalDebt,
      totalInterest,
      totalPayments,
      monthsToFreedom,
      monthlyPayment: totalMonthlyPayment,
      extraPayment,
      savings,
      payments,
      explanation: this.generateCustomExplanation(debts, monthsToFreedom),
      tips: this.generateCustomTips()
    };
  }

  private static calculateSavings(debts: Debt[], totalPayments: number): number {
    // Calcular cuánto pagarían solo con pagos mínimos
    const totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const averageInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length;
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    
    // Estimación simple de ahorros
    const monthsWithMinimums = totalDebt / totalMinimumPayments;
    const interestWithMinimums = totalDebt * (averageInterestRate / 100) * (monthsWithMinimums / 12);
    const totalWithMinimums = totalDebt + interestWithMinimums;
    
    return Math.max(0, totalWithMinimums - totalPayments);
  }

  private static generateAvalancheExplanation(debts: Debt[], monthsToFreedom: number, savings: number): string {
    const highestInterestDebt = debts.reduce((max, debt) => 
      debt.interestRate > max.interestRate ? debt : max
    );
    
    return `El método avalancha te enfoca en pagar primero la deuda con mayor tasa de interés (${highestInterestDebt.name} al ${highestInterestDebt.interestRate}%). Esto te ahorrará $${savings.toLocaleString()} en intereses y te liberará de deudas en ${monthsToFreedom} meses. Es la estrategia más eficiente económicamente.`;
  }

  private static generateSnowballExplanation(debts: Debt[], monthsToFreedom: number): string {
    const smallestDebt = debts.reduce((min, debt) => 
      debt.balance < min.balance ? debt : min
    );
    
    return `El método bola de nieve te enfoca en pagar primero la deuda más pequeña (${smallestDebt.name} de $${smallestDebt.balance.toLocaleString()}). Esto te dará motivación al ver progreso rápido y liberará dinero para pagar las siguientes deudas. Te liberarás en ${monthsToFreedom} meses.`;
  }

  private static generateCustomExplanation(debts: Debt[], monthsToFreedom: number): string {
    return `Tu estrategia personalizada te permite priorizar las deudas según tus necesidades específicas. Esto puede incluir factores como relaciones con acreedores, plazos de vencimiento, o metas personales. Te liberarás en ${monthsToFreedom} meses.`;
  }

  private static generateAvalancheTips(): string[] {
    return [
      'Mantén el enfoque en la deuda con mayor interés, no te distraigas con otras',
      'Si puedes aumentar el pago extra, hazlo para acelerar el proceso',
      'Considera transferir deudas de alto interés a tarjetas con 0% APR si es posible',
      'Revisa tu presupuesto mensualmente para encontrar dinero extra',
      'Celebra cada deuda que pagues completamente'
    ];
  }

  private static generateSnowballTips(): string[] {
    return [
      'Paga la deuda más pequeña primero, sin importar la tasa de interés',
      'Una vez que pagues una deuda, usa ese dinero para la siguiente',
      'Mantén un registro visual de tu progreso para motivarte',
      'Comparte tu progreso con familiares o amigos para mantenerte responsable',
      'No agregues nuevas deudas mientras pagas las existentes'
    ];
  }

  private static generateCustomTips(): string[] {
    return [
      'Revisa y ajusta tus prioridades según cambien tus circunstancias',
      'Considera factores como plazos de vencimiento y relaciones con acreedores',
      'Mantén un enfoque consistente en tu estrategia elegida',
      'Documenta por qué elegiste cada prioridad para mantenerte enfocado',
      'Revisa tu progreso mensualmente y ajusta si es necesario'
    ];
  }
}

// Utilidades adicionales
export const DEBT_TYPES = {
  credit_card: { name: 'Tarjeta de Crédito', icon: '💳', color: 'red' },
  personal_loan: { name: 'Préstamo Personal', icon: '🏦', color: 'blue' },
  mortgage: { name: 'Hipoteca', icon: '🏠', color: 'green' },
  car_loan: { name: 'Préstamo de Auto', icon: '🚗', color: 'purple' },
  student_loan: { name: 'Préstamo Estudiantil', icon: '🎓', color: 'indigo' },
  other: { name: 'Otra Deuda', icon: '📋', color: 'gray' }
};

export const STRATEGY_DESCRIPTIONS = {
  avalanche: {
    name: 'Método Avalancha',
    description: 'Paga primero la deuda con mayor tasa de interés',
    pros: ['Ahorra más dinero en intereses', 'Estratégicamente eficiente'],
    cons: ['Puede tomar más tiempo ver progreso', 'Requiere disciplina']
  },
  snowball: {
    name: 'Método Bola de Nieve',
    description: 'Paga primero la deuda más pequeña',
    pros: ['Motivación rápida', 'Libera dinero rápido'],
    cons: ['Puede costar más en intereses', 'No es matemáticamente óptimo']
  },
  custom: {
    name: 'Estrategia Personalizada',
    description: 'Prioriza deudas según tus necesidades específicas',
    pros: ['Flexibilidad total', 'Se adapta a tu situación'],
    cons: ['Requiere más planificación', 'Puede no ser óptimo']
  }
};
