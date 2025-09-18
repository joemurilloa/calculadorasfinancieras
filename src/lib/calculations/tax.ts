// Librería de cálculos de impuestos - México
export interface TaxInput {
  // Información del contribuyente
  taxpayerType: 'individual' | 'business';
  regime: 'simplified' | 'general' | 'wage_earner' | 'professional_services';
  
  // Ingresos
  monthlyIncome: number;
  annualIncome: number;
  
  // Gastos y deducciones
  businessExpenses: number;
  personalDeductions: number;
  medicalExpenses: number;
  educationalExpenses: number;
  mortgageInterest: number;
  donations: number;
  
  // IVA
  vatRate: number; // 0.16 para 16%
  vatCollected: number;
  vatPaid: number;
  
  // Retenciones
  withholdingTax: number;
  isrWithholding: number;
  
  // Otros
  otherIncome: number;
  otherDeductions: number;
}

export interface TaxResult {
  // ISR (Impuesto Sobre la Renta)
  isr: {
    taxableIncome: number;
    isrCalculated: number;
    isrWithholding: number;
    isrToPay: number;
    effectiveRate: number;
  };
  
  // IVA (Impuesto al Valor Agregado)
  vat: {
    vatCollected: number;
    vatPaid: number;
    vatToPay: number;
    vatToRefund: number;
  };
  
  // Totales
  totalTaxes: number;
  netIncome: number;
  taxOptimization: {
    recommendations: string[];
    potentialSavings: number;
  };
  
  // Desglose detallado
  breakdown: {
    grossIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    totalTaxes: number;
    netIncome: number;
  };
}

export class TaxCalculator {
  // Tablas de ISR 2024 - Personas Físicas
  private static readonly ISR_TABLES = {
    individual: [
      { min: 0, max: 12892.32, rate: 0.0192, fixed: 0 },
      { min: 12892.33, max: 10928.33, rate: 0.0640, fixed: 247.23 },
      { min: 10928.34, max: 10928.33, rate: 0.1088, fixed: 914.96 },
      { min: 10928.34, max: 10928.33, rate: 0.1600, fixed: 2000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.1792, fixed: 3000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.2136, fixed: 4000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.2352, fixed: 5000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.3000, fixed: 6000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.3200, fixed: 7000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.3400, fixed: 8000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.3500, fixed: 9000.00 },
      { min: 10928.34, max: 10928.33, rate: 0.4000, fixed: 10000.00 }
    ],
    business: [
      { min: 0, max: 300000, rate: 0.30, fixed: 0 },
      { min: 300001, max: 600000, rate: 0.30, fixed: 90000 },
      { min: 600001, max: 1000000, rate: 0.30, fixed: 180000 },
      { min: 1000001, max: 2000000, rate: 0.30, fixed: 300000 },
      { min: 2000001, max: 3000000, rate: 0.30, fixed: 600000 },
      { min: 3000001, max: 999999999, rate: 0.30, fixed: 900000 }
    ]
  };

  // Límites de deducciones 2024
  private static readonly DEDUCTION_LIMITS = {
    medical: 0.15, // 15% del ingreso
    educational: 0.10, // 10% del ingreso
    mortgage: 0.10, // 10% del ingreso
    donations: 0.07, // 7% del ingreso
    total: 0.15 // 15% del ingreso total
  };

  static calculate(input: TaxInput): TaxResult {
    // Calcular ingresos totales
    const totalIncome = input.monthlyIncome * 12 + input.otherIncome;
    
    // Calcular deducciones totales
    const totalDeductions = this.calculateTotalDeductions(input, totalIncome);
    
    // Calcular ingreso gravable
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);
    
    // Calcular ISR
    const isrResult = this.calculateISR(taxableIncome, input.taxpayerType);
    
    // Calcular IVA
    const vatResult = this.calculateVAT(input);
    
    // Calcular totales
    const totalTaxes = isrResult.isrCalculated + vatResult.vatToPay;
    const netIncome = totalIncome - totalTaxes;
    
    // Generar recomendaciones de optimización
    const optimization = this.generateOptimizationRecommendations(input, totalIncome, totalDeductions);
    
    return {
      isr: isrResult,
      vat: vatResult,
      totalTaxes,
      netIncome,
      taxOptimization: optimization,
      breakdown: {
        grossIncome: totalIncome,
        totalDeductions,
        taxableIncome,
        totalTaxes,
        netIncome
      }
    };
  }

  private static calculateTotalDeductions(input: TaxInput, totalIncome: number): number {
    let totalDeductions = 0;
    
    // Gastos de negocio (solo para régimen general)
    if (input.regime === 'general') {
      totalDeductions += input.businessExpenses;
    }
    
    // Deducciones personales con límites
    const medicalLimit = totalIncome * this.DEDUCTION_LIMITS.medical;
    totalDeductions += Math.min(input.medicalExpenses, medicalLimit);
    
    const educationalLimit = totalIncome * this.DEDUCTION_LIMITS.educational;
    totalDeductions += Math.min(input.educationalExpenses, educationalLimit);
    
    const mortgageLimit = totalIncome * this.DEDUCTION_LIMITS.mortgage;
    totalDeductions += Math.min(input.mortgageInterest, mortgageLimit);
    
    const donationsLimit = totalIncome * this.DEDUCTION_LIMITS.donations;
    totalDeductions += Math.min(input.donations, donationsLimit);
    
    // Otras deducciones
    totalDeductions += input.otherDeductions;
    
    // Límite total de deducciones
    const maxDeductions = totalIncome * this.DEDUCTION_LIMITS.total;
    return Math.min(totalDeductions, maxDeductions);
  }

  private static calculateISR(taxableIncome: number, taxpayerType: 'individual' | 'business'): any {
    const table = this.ISR_TABLES[taxpayerType];
    
    for (const bracket of table) {
      if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
        const isrCalculated = (taxableIncome - bracket.min) * bracket.rate + bracket.fixed;
        const effectiveRate = (isrCalculated / taxableIncome) * 100;
        
        return {
          taxableIncome,
          isrCalculated: Math.round(isrCalculated * 100) / 100,
          isrWithholding: 0, // Se calculará por separado
          isrToPay: Math.round(isrCalculated * 100) / 100,
          effectiveRate: Math.round(effectiveRate * 100) / 100
        };
      }
    }
    
    // Si no encuentra bracket, usar el último
    const lastBracket = table[table.length - 1];
    const isrCalculated = (taxableIncome - lastBracket.min) * lastBracket.rate + lastBracket.fixed;
    const effectiveRate = (isrCalculated / taxableIncome) * 100;
    
    return {
      taxableIncome,
      isrCalculated: Math.round(isrCalculated * 100) / 100,
      isrWithholding: 0,
      isrToPay: Math.round(isrCalculated * 100) / 100,
      effectiveRate: Math.round(effectiveRate * 100) / 100
    };
  }

  private static calculateVAT(input: TaxInput): any {
    const vatCollected = input.vatCollected;
    const vatPaid = input.vatPaid;
    const vatToPay = Math.max(0, vatCollected - vatPaid);
    const vatToRefund = Math.max(0, vatPaid - vatCollected);
    
    return {
      vatCollected,
      vatPaid,
      vatToPay: Math.round(vatToPay * 100) / 100,
      vatToRefund: Math.round(vatToRefund * 100) / 100
    };
  }

  private static generateOptimizationRecommendations(input: TaxInput, totalIncome: number, totalDeductions: number): any {
    const recommendations: string[] = [];
    let potentialSavings = 0;
    
    // Verificar límites de deducciones
    const medicalLimit = totalIncome * this.DEDUCTION_LIMITS.medical;
    if (input.medicalExpenses < medicalLimit) {
      recommendations.push(`Puedes deducir hasta $${medicalLimit.toLocaleString()} en gastos médicos`);
    }
    
    const educationalLimit = totalIncome * this.DEDUCTION_LIMITS.educational;
    if (input.educationalExpenses < educationalLimit) {
      recommendations.push(`Puedes deducir hasta $${educationalLimit.toLocaleString()} en gastos educativos`);
    }
    
    // Recomendaciones por régimen
    if (input.regime === 'simplified') {
      recommendations.push('Considera cambiar al régimen general si tienes más de $2,000,000 en ingresos');
    }
    
    if (input.regime === 'general' && input.businessExpenses < totalIncome * 0.3) {
      recommendations.push('Aumenta tus gastos de negocio para reducir el ISR');
      potentialSavings += (totalIncome * 0.3 - input.businessExpenses) * 0.3;
    }
    
    // Optimización de IVA
    if (input.vatPaid < input.vatCollected * 0.5) {
      recommendations.push('Considera aumentar tus compras con IVA para reducir el IVA a pagar');
    }
    
    return {
      recommendations,
      potentialSavings: Math.round(potentialSavings * 100) / 100
    };
  }
}

// Utilidades adicionales
export const TAX_CONSTANTS = {
  VAT_RATE: 0.16,
  ISR_WITHHOLDING_RATE: 0.10,
  MAX_DEDUCTIONS_PERCENTAGE: 0.15,
  MINIMUM_WAGE_2024: 248.93,
  UMA_2024: 103.74
};

export const REGIME_DESCRIPTIONS = {
  simplified: 'Régimen Simplificado de Confianza - Para personas físicas con ingresos menores a $2,000,000',
  general: 'Régimen General - Para personas físicas y morales con ingresos mayores a $2,000,000',
  wage_earner: 'Sueldos y Salarios - Para trabajadores asalariados',
  professional_services: 'Servicios Profesionales - Para profesionistas independientes'
};
