// Librería de cálculos de ROI
export interface InvestmentData {
  initialAmount: number;
  additionalCosts: number;
  investmentDate: string;
}

export interface ReturnsData {
  monthlyRevenueIncrease: number;
  monthlyCostSavings: number;
  residualValue: number;
}

export interface ParametersData {
  analysisPeriodMonths: number;
  discountRate: number;
  inflationRate: number;
}

export interface ROIScenario {
  name: string;
  roiPercentage: number;
  npv: number;
  paybackMonths: number | null;
  description: string;
}

export interface ROIMetrics {
  simpleRoi: number;
  annualizedRoi: number;
  npv: number;
  irr: number | null;
  paybackPeriodMonths: number | null;
  breakEvenMonth: number | null;
}

export interface ROIAnalysis {
  investmentGrade: 'Excelente' | 'Buena' | 'Regular' | 'Mala';
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  recommendation: string;
  keyFactors: string[];
}

export interface ROIResult {
  investmentData: InvestmentData;
  returnsData: ReturnsData;
  parametersData: ParametersData;
  metrics: ROIMetrics;
  scenarios: ROIScenario[];
  timeline: Array<{
    month: number;
    cashFlow: number;
    cumulative: number;
    npv: number;
  }>;
  analysis: ROIAnalysis;
}

export class ROICalculator {
  /**
   * Calcula el ROI con análisis completo
   */
  static calculate(
    investment: InvestmentData,
    returns: ReturnsData,
    parameters: ParametersData
  ): ROIResult {
    
    // Calcular totales
    const totalInvestment = investment.initialAmount + investment.additionalCosts;
    const monthlyReturns = returns.monthlyRevenueIncrease + returns.monthlyCostSavings;
    
    // Generar flujo de caja
    const cashFlows = [-totalInvestment];
    for (let month = 0; month < parameters.analysisPeriodMonths; month++) {
      let monthlyFlow = monthlyReturns;
      if (month === parameters.analysisPeriodMonths - 1) {
        monthlyFlow += returns.residualValue;
      }
      cashFlows.push(monthlyFlow);
    }
    
    // Calcular métricas principales
    const totalReturns = monthlyReturns * parameters.analysisPeriodMonths + returns.residualValue;
    
    const simpleRoi = ((totalReturns - totalInvestment) / totalInvestment) * 100;
    const annualizedRoi = (Math.pow(totalReturns / totalInvestment, 12 / parameters.analysisPeriodMonths) - 1) * 100;
    
    // Calcular NPV
    const monthlyDiscountRate = parameters.discountRate / 12;
    let npv = -totalInvestment;
    for (let month = 0; month < parameters.analysisPeriodMonths; month++) {
      let monthlyFlow = monthlyReturns;
      if (month === parameters.analysisPeriodMonths - 1) {
        monthlyFlow += returns.residualValue;
      }
      npv += monthlyFlow / Math.pow(1 + monthlyDiscountRate, month + 1);
    }
    
    // Calcular IRR
    const irr = this.calculateIRR(cashFlows);
    
    // Calcular período de recuperación
    let paybackMonths: number | null = null;
    let breakEvenMonth: number | null = null;
    let cumulative = -totalInvestment;
    
    for (let month = 0; month < parameters.analysisPeriodMonths; month++) {
      cumulative += monthlyReturns;
      if (cumulative >= 0 && breakEvenMonth === null) {
        breakEvenMonth = month + 1;
        paybackMonths = month + 1;
        break;
      }
    }
    
    // Crear métricas
    const metrics: ROIMetrics = {
      simpleRoi: Math.round(simpleRoi * 100) / 100,
      annualizedRoi: Math.round(annualizedRoi * 100) / 100,
      npv: Math.round(npv * 100) / 100,
      irr: irr ? Math.round(irr * 10000) / 100 : null, // convertir a porcentaje
      paybackPeriodMonths: paybackMonths,
      breakEvenMonth: breakEvenMonth
    };
    
    // Generar escenarios
    const scenarios = this.generateScenarios(monthlyReturns, totalInvestment, parameters.analysisPeriodMonths);
    
    // Generar timeline
    const timeline = this.generateTimeline(totalInvestment, monthlyReturns, returns.residualValue, parameters, monthlyDiscountRate);
    
    // Analizar inversión
    const analysis = this.analyzeInvestment(metrics);
    
    return {
      investmentData: investment,
      returnsData: returns,
      parametersData: parameters,
      metrics,
      scenarios,
      timeline,
      analysis
    };
  }
  
  /**
   * Calcula la Tasa Interna de Retorno usando método Newton-Raphson
   */
  private static calculateIRR(cashFlows: number[], maxIterations = 100): number | null {
    if (!cashFlows || cashFlows.length < 2) return null;
    
    let rate = 0.1;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;
      
      for (let j = 0; j < cashFlows.length; j++) {
        npv += cashFlows[j] / Math.pow(1 + rate, j);
        dnpv += -j * cashFlows[j] / Math.pow(1 + rate, j + 1);
      }
      
      if (Math.abs(npv) < 1e-6) return rate;
      if (Math.abs(dnpv) < 1e-10) break;
      
      rate = rate - npv / dnpv;
      
      if (rate < -0.99) rate = -0.99;
      else if (rate > 10) rate = 10;
    }
    
    return Math.abs(cashFlows.reduce((npv, cf, i) => npv + cf / Math.pow(1 + rate, i), 0)) < 0.01 ? rate : null;
  }
  
  /**
   * Genera escenarios optimista, realista y pesimista
   */
  private static generateScenarios(baseReturns: number, baseInvestment: number, periodMonths: number): ROIScenario[] {
    const scenarios: ROIScenario[] = [];
    
    // Escenario Pesimista (-30% returns, +20% costs)
    const pessimisticReturns = baseReturns * 0.7;
    const pessimisticInvestment = baseInvestment * 1.2;
    const pessimisticRoi = ((pessimisticReturns * periodMonths - pessimisticInvestment) / pessimisticInvestment) * 100;
    
    scenarios.push({
      name: "Pesimista",
      roiPercentage: Math.round(pessimisticRoi * 100) / 100,
      npv: pessimisticReturns * periodMonths - pessimisticInvestment,
      paybackMonths: pessimisticReturns > 0 ? Math.ceil(pessimisticInvestment / pessimisticReturns) : null,
      description: "Escenario con reducción del 30% en retornos"
    });
    
    // Escenario Realista (base case)
    const realisticRoi = ((baseReturns * periodMonths - baseInvestment) / baseInvestment) * 100;
    
    scenarios.push({
      name: "Realista",
      roiPercentage: Math.round(realisticRoi * 100) / 100,
      npv: baseReturns * periodMonths - baseInvestment,
      paybackMonths: baseReturns > 0 ? Math.ceil(baseInvestment / baseReturns) : null,
      description: "Escenario base con proyecciones actuales"
    });
    
    // Escenario Optimista (+50% returns, -10% costs)
    const optimisticReturns = baseReturns * 1.5;
    const optimisticInvestment = baseInvestment * 0.9;
    const optimisticRoi = ((optimisticReturns * periodMonths - optimisticInvestment) / optimisticInvestment) * 100;
    
    scenarios.push({
      name: "Optimista",
      roiPercentage: Math.round(optimisticRoi * 100) / 100,
      npv: optimisticReturns * periodMonths - optimisticInvestment,
      paybackMonths: optimisticReturns > 0 ? Math.ceil(optimisticInvestment / optimisticReturns) : null,
      description: "Escenario con incremento del 50% en retornos"
    });
    
    return scenarios;
  }
  
  /**
   * Genera timeline mes a mes
   */
  private static generateTimeline(
    totalInvestment: number, 
    monthlyReturns: number, 
    residualValue: number, 
    parameters: ParametersData,
    monthlyDiscountRate: number
  ) {
    const timeline = [];
    let cumulative = -totalInvestment;
    
    // Mes 0 (inversión inicial)
    timeline.push({
      month: 0,
      cashFlow: -totalInvestment,
      cumulative: cumulative,
      npv: -totalInvestment
    });
    
    // Meses posteriores
    for (let month = 1; month <= parameters.analysisPeriodMonths; month++) {
      let monthlyFlow = monthlyReturns;
      if (month === parameters.analysisPeriodMonths) {
        monthlyFlow += residualValue;
      }
      
      cumulative += monthlyFlow;
      const npvMonth = monthlyFlow / Math.pow(1 + monthlyDiscountRate, month);
      
      timeline.push({
        month: month,
        cashFlow: Math.round(monthlyFlow * 100) / 100,
        cumulative: Math.round(cumulative * 100) / 100,
        npv: Math.round(npvMonth * 100) / 100
      });
    }
    
    return timeline;
  }
  
  /**
   * Analiza la inversión y genera recomendaciones
   */
  private static analyzeInvestment(metrics: ROIMetrics): ROIAnalysis {
    // Determinar grado de inversión
    let grade: 'Excelente' | 'Buena' | 'Regular' | 'Mala';
    if (metrics.annualizedRoi >= 50) {
      grade = "Excelente";
    } else if (metrics.annualizedRoi >= 25) {
      grade = "Buena";
    } else if (metrics.annualizedRoi >= 10) {
      grade = "Regular";
    } else {
      grade = "Mala";
    }
    
    // Determinar nivel de riesgo
    let risk: 'Bajo' | 'Medio' | 'Alto';
    if (metrics.paybackPeriodMonths && metrics.paybackPeriodMonths <= 6) {
      risk = "Bajo";
    } else if (metrics.paybackPeriodMonths && metrics.paybackPeriodMonths <= 18) {
      risk = "Medio";
    } else {
      risk = "Alto";
    }
    
    // Recomendaciones
    const recommendations = {
      "Excelente": "Inversión altamente recomendada. ROI excepcional con retorno rápido.",
      "Buena": "Inversión recomendada. Buen balance entre retorno y riesgo.",
      "Regular": "Inversión a considerar. Evaluar alternativas antes de decidir.",
      "Mala": "Inversión no recomendada. Buscar mejores oportunidades de inversión."
    };
    
    // Factores clave
    const keyFactors = [
      `ROI anualizado del ${metrics.annualizedRoi.toFixed(1)}%`,
      metrics.paybackPeriodMonths 
        ? `Período de recuperación: ${metrics.paybackPeriodMonths} meses`
        : "Sin recuperación clara",
      `VPN de $${metrics.npv.toLocaleString()}`,
      `Nivel de riesgo: ${risk}`
    ];
    
    if (metrics.irr) {
      keyFactors.push(`TIR del ${metrics.irr.toFixed(1)}%`);
    }
    
    return {
      investmentGrade: grade,
      riskLevel: risk,
      recommendation: recommendations[grade],
      keyFactors
    };
  }
}
