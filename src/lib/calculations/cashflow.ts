// Librería de cálculos de flujo de caja
export interface LineItem {
  name: string;
  amount: number;
}

export interface CashflowInput {
  startingCash: number;
  revenue: LineItem[];
  otherInflows: LineItem[];
  cogs: LineItem[];
  opexFixed: LineItem[];
  opexVariable: LineItem[];
  payroll: LineItem[];
  loanInterest: LineItem[];
  loanPrincipal: LineItem[];
  capex: LineItem[];
  otherOutflows: LineItem[];
  taxRate: number; // 0-1
  roundTo?: number;
}

export interface CashflowTotals {
  totalInflows: number;
  totalOutflows: number;
  taxesCash: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  netCashFlow: number;
  endingCash: number;
  burnRate: number;
  runwayMonths: number | null;
}

export interface CashflowBreakdown {
  inflows: LineItem[];
  outflows: LineItem[];
}

export interface CashflowAnalysis {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface CashflowResult {
  totals: CashflowTotals;
  breakdown: CashflowBreakdown;
  analysis: CashflowAnalysis;
}

export class CashflowCalculator {
  /**
   * Calcula el flujo de caja mensual completo
   */
  static calculate(input: CashflowInput): CashflowResult {
    const roundTo = input.roundTo || 2;
    
    // Calcular totales de ingresos
    const revenue = this.sumItems(input.revenue);
    const otherInflows = this.sumItems(input.otherInflows);
    const totalInflows = revenue + otherInflows;
    
    // Calcular egresos operativos
    const cogs = this.sumItems(input.cogs);
    const opexFixed = this.sumItems(input.opexFixed);
    const opexVariable = this.sumItems(input.opexVariable);
    const payroll = this.sumItems(input.payroll);
    const operatingCashOut = cogs + opexFixed + opexVariable + payroll;
    
    // Calcular egresos financieros y de inversión
    const loanInterest = this.sumItems(input.loanInterest);
    const loanPrincipal = this.sumItems(input.loanPrincipal);
    const capex = this.sumItems(input.capex);
    const otherOutflows = this.sumItems(input.otherOutflows);
    
    // Calcular impuestos (solo sobre utilidad operativa positiva)
    const operatingProfitApprox = revenue - operatingCashOut - loanInterest;
    const taxesCash = operatingProfitApprox > 0 && input.taxRate > 0 
      ? operatingProfitApprox * input.taxRate 
      : 0;
    
    // Totales finales
    const totalOutflows = operatingCashOut + loanInterest + loanPrincipal + capex + otherOutflows + taxesCash;
    const netCashFlow = totalInflows - totalOutflows;
    const endingCash = input.startingCash + netCashFlow;
    
    const operatingCashFlow = revenue - operatingCashOut - taxesCash;
    const freeCashFlow = operatingCashFlow - capex;
    
    // Burn rate y runway
    const burnRate = netCashFlow < 0 ? -netCashFlow : 0;
    const runwayMonths = burnRate > 0 ? input.startingCash / burnRate : null;
    
    // Determinar nivel de riesgo
    let riskLevel: 'low' | 'medium' | 'high';
    if (netCashFlow >= 0 && (!runwayMonths || runwayMonths >= 6)) {
      riskLevel = 'low';
    } else if (netCashFlow >= 0 || (runwayMonths && runwayMonths >= 3)) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }
    
    // Generar análisis y recomendaciones
    const analysis = this.generateAnalysis(
      netCashFlow, endingCash, operatingCashFlow, freeCashFlow, 
      runwayMonths, riskLevel, roundTo, totalInflows, totalOutflows,
      { cogs, opexFixed, opexVariable, payroll, loanInterest, loanPrincipal, capex, otherOutflows }
    );
    
    // Crear totales redondeados
    const totals: CashflowTotals = {
      totalInflows: this.round(totalInflows, roundTo),
      totalOutflows: this.round(totalOutflows, roundTo),
      taxesCash: this.round(taxesCash, roundTo),
      operatingCashFlow: this.round(operatingCashFlow, roundTo),
      freeCashFlow: this.round(freeCashFlow, roundTo),
      netCashFlow: this.round(netCashFlow, roundTo),
      endingCash: this.round(endingCash, roundTo),
      burnRate: this.round(burnRate, roundTo),
      runwayMonths: runwayMonths ? this.round(runwayMonths, roundTo) : null
    };
    
    // Crear breakdown
    const breakdown: CashflowBreakdown = {
      inflows: [
        { name: "Ingresos", amount: this.round(revenue, roundTo) },
        { name: "Otros ingresos", amount: this.round(otherInflows, roundTo) }
      ],
      outflows: [
        { name: "COGS", amount: this.round(cogs, roundTo) },
        { name: "OPEX fijo", amount: this.round(opexFixed, roundTo) },
        { name: "OPEX variable", amount: this.round(opexVariable, roundTo) },
        { name: "Nómina", amount: this.round(payroll, roundTo) },
        { name: "Impuestos (cash)", amount: this.round(taxesCash, roundTo) },
        { name: "Intereses", amount: this.round(loanInterest, roundTo) },
        { name: "Principal deuda", amount: this.round(loanPrincipal, roundTo) },
        { name: "CapEx", amount: this.round(capex, roundTo) },
        { name: "Otros egresos", amount: this.round(otherOutflows, roundTo) }
      ]
    };
    
    return {
      totals,
      breakdown,
      analysis
    };
  }
  
  /**
   * Suma los elementos de una lista
   */
  private static sumItems(items: LineItem[]): number {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  
  /**
   * Redondea un número
   */
  private static round(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  
  /**
   * Genera análisis y recomendaciones
   */
  private static generateAnalysis(
    netCashFlow: number, endingCash: number, operatingCashFlow: number, 
    freeCashFlow: number, runwayMonths: number | null, riskLevel: string,
    roundTo: number, totalInflows: number, totalOutflows: number,
    buckets: {
      cogs: number;
      opexFixed: number;
      opexVariable: number;
      payroll: number;
      loanInterest: number;
      loanPrincipal: number;
      capex: number;
      otherOutflows: number;
    }
  ): CashflowAnalysis {
    
    let summary: string;
    let recommendations: string[];
    
    if (netCashFlow >= 0) {
      summary = `Flujo de caja positivo de ${this.round(netCashFlow, roundTo)}. ` +
               `Saldo final ${this.round(endingCash, roundTo)}. ` +
               `Flujo operativo ${this.round(operatingCashFlow, roundTo)}; ` +
               `FCF ${this.round(freeCashFlow, roundTo)}.`;
      
      recommendations = [
        "Considera destinar 10-20% del flujo positivo a un fondo de reserva (runway).",
        "Evalúa reducir deuda con mayor tasa utilizando el excedente.",
        "Reinvierte en canales con ROI probado (p. ej., campañas con CAC < LTV)."
      ];
    } else {
      summary = `Flujo de caja negativo de ${this.round(-netCashFlow, roundTo)} (burn). ` +
               `Runway estimado: ${runwayMonths ? this.round(runwayMonths, roundTo) : 0} meses.`;
      
      // Identificar los mayores egresos
      const expenseBuckets = [
        ["COGS", buckets.cogs],
        ["OPEX fijo", buckets.opexFixed],
        ["OPEX variable", buckets.opexVariable],
        ["Nómina", buckets.payroll],
        ["Intereses", buckets.loanInterest],
        ["Principal deuda", buckets.loanPrincipal],
        ["CapEx", buckets.capex],
        ["Otros", buckets.otherOutflows]
      ];
      
      expenseBuckets.sort((a, b) => (b[1] as number) - (a[1] as number));
      const topExpenses = expenseBuckets
        .filter(([, amount]) => (amount as number) > 0)
        .slice(0, 3)
        .map(([name, amount]) => `${name}: ${this.round(amount as number, roundTo)}`)
        .join(", ");
      
      const recommendedRevenueIncrease = Math.max(0, totalOutflows - totalInflows);
      
      recommendations = [
        topExpenses 
          ? `Prioriza recortes en: ${topExpenses}`
          : "Revisa cada partida de gasto para identificar recortes.",
        "Negocia pagos con proveedores o alarga plazos para aliviar caja.",
        `Objetivo de aumento de ingresos: ${this.round(recommendedRevenueIncrease, roundTo)} para alcanzar punto de equilibrio de caja.`
      ];
    }
    
    return {
      summary,
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
      recommendations
    };
  }
}
