// Librería de cálculos de pricing financiera
export interface PricingInput {
  productName: string;
  costMaterials: number;
  costLabor: number;
  costOverhead: number;
  desiredProfitMargin: number;
  competitorPrices?: number[];
  targetMarket?: string;
}

export interface PricingResult {
  recommendedPrice: number;
  costBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
    totalCost: number;
    profitAmount: number;
  };
  profitMargin: number;
  competitiveAnalysis: {
    minPrice?: number;
    maxPrice?: number;
    avgPrice?: number;
    medianPrice?: number;
    stdDeviation?: number;
    message?: string;
  };
  pricingStrategies: Array<{
    name: string;
    price: number;
    description: string;
    pros: string[];
    cons: string[];
  }>;
  financialProjections: {
    breakEvenUnits: number;
    monthlyRevenue100Units: number;
    monthlyProfit100Units: number;
    roiPercentage: number;
  };
}

export class PricingCalculator {
  /**
   * Calcula el precio ideal con análisis completo
   */
  static calculate(input: PricingInput): PricingResult {
    // Cálculo del costo base
    const totalCost = input.costMaterials + input.costLabor + input.costOverhead;
    
    // Precio con margen deseado
    const marginDecimal = input.desiredProfitMargin / 100;
    const recommendedPrice = totalCost / (1 - marginDecimal);
    
    // Análisis de competidores
    const competitiveAnalysis = this.analyzeCompetition(input.competitorPrices || []);
    
    // Estrategias de precios
    const pricingStrategies = this.generatePricingStrategies(totalCost, competitiveAnalysis);
    
    // Breakdown de costos
    const costBreakdown = {
      materials: input.costMaterials,
      labor: input.costLabor,
      overhead: input.costOverhead,
      totalCost: totalCost,
      profitAmount: recommendedPrice - totalCost
    };
    
    // Proyecciones financieras
    const financialProjections = {
      breakEvenUnits: 1,
      monthlyRevenue100Units: recommendedPrice * 100,
      monthlyProfit100Units: (recommendedPrice - totalCost) * 100,
      roiPercentage: ((recommendedPrice - totalCost) / totalCost) * 100
    };
    
    return {
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      costBreakdown,
      profitMargin: input.desiredProfitMargin,
      competitiveAnalysis,
      pricingStrategies,
      financialProjections
    };
  }
  
  /**
   * Analiza precios de competidores
   */
  private static analyzeCompetition(competitorPrices: number[]) {
    if (!competitorPrices || competitorPrices.length === 0) {
      return { message: "No hay datos de competidores" };
    }
    
    const prices = competitorPrices.filter(p => p > 0);
    if (prices.length === 0) {
      return { message: "No hay precios válidos de competidores" };
    }
    
    // Estadísticas básicas
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    // Mediana
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const medianPrice = sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)];
    
    // Desviación estándar
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) / prices.length;
    const stdDeviation = Math.sqrt(variance);
    
    return {
      minPrice: Math.round(minPrice * 100) / 100,
      maxPrice: Math.round(maxPrice * 100) / 100,
      avgPrice: Math.round(avgPrice * 100) / 100,
      medianPrice: Math.round(medianPrice * 100) / 100,
      stdDeviation: Math.round(stdDeviation * 100) / 100
    };
  }
  
  /**
   * Genera estrategias de precios
   */
  private static generatePricingStrategies(baseCost: number, competitorAnalysis: {
    minPrice?: number;
    maxPrice?: number;
    avgPrice?: number;
    medianPrice?: number;
    stdDeviation?: number;
    message?: string;
  }) {
    const strategies = [];
    
    // Estrategia conservadora (20% margen)
    const conservativePrice = baseCost * 1.20;
    strategies.push({
      name: "Conservadora",
      price: Math.round(conservativePrice * 100) / 100,
      description: "Margen bajo pero seguro, ideal para empezar",
      pros: ["Fácil venta", "Competitivo"],
      cons: ["Menor ganancia"]
    });
    
    // Estrategia competitiva
    if (competitorAnalysis.avgPrice) {
      strategies.push({
        name: "Competitiva",
        price: competitorAnalysis.avgPrice,
        description: "Precio similar al promedio del mercado",
        pros: ["Equilibrio", "Aceptación del mercado"],
        cons: ["Menos diferenciación"]
      });
    }
    
    // Estrategia premium (50% margen)
    const premiumPrice = baseCost * 1.50;
    strategies.push({
      name: "Premium",
      price: Math.round(premiumPrice * 100) / 100,
      description: "Alto margen, enfoque en calidad y valor",
      pros: ["Mayor ganancia", "Percepción de calidad"],
      cons: ["Mercado más pequeño"]
    });
    
    return strategies;
  }
}

// Estrategias de pricing adicionales
export const PRICING_STRATEGIES = [
  {
    name: "Penetración de Mercado",
    description: "Precios bajos para ganar participación",
    bestFor: "Productos nuevos, mercados competitivos"
  },
  {
    name: "Descremado",
    description: "Precios altos iniciales, luego reducción",
    bestFor: "Productos innovadores, early adopters"
  },
  {
    name: "Precio Competitivo",
    description: "Precio similar a competidores",
    bestFor: "Mercados maduros, productos similares"
  },
  {
    name: "Precio Premium",
    description: "Precios altos basados en valor percibido",
    bestFor: "Productos de calidad superior, marca fuerte"
  }
];
