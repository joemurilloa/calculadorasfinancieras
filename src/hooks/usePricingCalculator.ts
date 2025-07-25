import { useState, useCallback, useMemo } from 'react';

export interface PricingData {
  productName: string;
  costMaterials: number;
  costLabor: number;
  costOverhead: number;
  desiredProfitMargin: number;
  competitorPrices: string;
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
  };
  pricingStrategies: Array<{
    name: string;
    price: number;
    description: string;
    pros: string[];
    cons: string[];
  }>;
  financialProjections: {
    monthlyRevenue100Units: number;
    monthlyProfit100Units: number;
    roiPercentage: number;
  };
}

export const usePricingCalculator = () => {
  const [formData, setFormData] = useState<PricingData>({
    productName: '',
    costMaterials: 0,
    costLabor: 0,
    costOverhead: 0,
    desiredProfitMargin: 30,
    competitorPrices: ''
  });

  const [result, setResult] = useState<PricingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetCalculator = useCallback(() => {
    setFormData({
      productName: '',
      costMaterials: 0,
      costLabor: 0,
      costOverhead: 0,
      desiredProfitMargin: 30,
      competitorPrices: ''
    });
    setResult(null);
    setErrors({});
  }, []);

  // Memoizar la validación para evitar recálculos innecesarios
  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'El nombre del producto es requerido';
    }

    if (formData.costMaterials < 0) {
      newErrors.costMaterials = 'El costo de materiales no puede ser negativo';
    }

    if (formData.costLabor < 0) {
      newErrors.costLabor = 'El costo de mano de obra no puede ser negativo';
    }

    if (formData.costOverhead < 0) {
      newErrors.costOverhead = 'Los gastos generales no pueden ser negativos';
    }

    if (formData.desiredProfitMargin < 0 || formData.desiredProfitMargin > 100) {
      newErrors.desiredProfitMargin = 'El margen de ganancia debe estar entre 0% y 100%';
    }

    const totalCost = formData.costMaterials + formData.costLabor + formData.costOverhead;
    if (totalCost === 0) {
      newErrors.totalCost = 'Al menos uno de los costos debe ser mayor que 0';
    }

    if (formData.competitorPrices.trim()) {
      const competitorPricesArray = formData.competitorPrices
        .split(',')
        .map(price => parseFloat(price.trim()))
        .filter(price => !isNaN(price));

      if (competitorPricesArray.length === 0) {
        newErrors.competitorPrices = 'Formato inválido. Use números separados por comas';
      } else if (competitorPricesArray.some(price => price < 0)) {
        newErrors.competitorPrices = 'Los precios no pueden ser negativos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Optimizar el manejo de cambios de input con useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limpiar errores cuando el usuario empieza a escribir
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name === 'desiredProfitMargin' 
        ? parseFloat(value) || 0 
        : value
    }));
  }, []);

  // Crear el fallback calculado solo cuando sea necesario
  const fallbackCalculation = useMemo(() => {
    const totalCost = formData.costMaterials + formData.costLabor + formData.costOverhead;
    const recommendedPrice = totalCost / (1 - formData.desiredProfitMargin / 100);
    const profitAmount = recommendedPrice - totalCost;
    
    const competitorPricesArray = formData.competitorPrices
      .split(',')
      .map(price => parseFloat(price.trim()))
      .filter(price => !isNaN(price));

    const avgCompetitorPrice = competitorPricesArray.length > 0 
      ? competitorPricesArray.reduce((a, b) => a + b) / competitorPricesArray.length 
      : 0;

    return {
      recommendedPrice,
      costBreakdown: {
        materials: formData.costMaterials,
        labor: formData.costLabor,
        overhead: formData.costOverhead,
        totalCost,
        profitAmount
      },
      profitMargin: formData.desiredProfitMargin,
      competitiveAnalysis: {
        minPrice: competitorPricesArray.length > 0 ? Math.min(...competitorPricesArray) : undefined,
        maxPrice: competitorPricesArray.length > 0 ? Math.max(...competitorPricesArray) : undefined,
        avgPrice: avgCompetitorPrice || undefined,
        medianPrice: competitorPricesArray.length > 0 ? competitorPricesArray.sort()[Math.floor(competitorPricesArray.length / 2)] : undefined
      },
      pricingStrategies: [
        {
          name: 'Conservadora',
          price: totalCost * 1.2,
          description: 'Margen bajo pero seguro, ideal para empezar',
          pros: ['Fácil venta', 'Competitivo'],
          cons: ['Menor ganancia']
        },
        {
          name: 'Competitiva',
          price: avgCompetitorPrice || recommendedPrice,
          description: 'Precio similar al promedio del mercado',
          pros: ['Equilibrio', 'Aceptación del mercado'],
          cons: ['Menos diferenciación']
        },
        {
          name: 'Premium',
          price: totalCost * 1.5,
          description: 'Alto margen, enfoque en calidad y valor',
          pros: ['Mayor ganancia', 'Percepción de calidad'],
          cons: ['Mercado más pequeño']
        }
      ],
      financialProjections: {
        monthlyRevenue100Units: recommendedPrice * 100,
        monthlyProfit100Units: profitAmount * 100,
        roiPercentage: (profitAmount / totalCost) * 100
      }
    };
  }, [formData]);

  // Optimizar la función de cálculo con useCallback
  const calculatePricing = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const competitorPricesArray = formData.competitorPrices
        .split(',')
        .map(price => parseFloat(price.trim()))
        .filter(price => !isNaN(price));

      const requestData = {
        product_name: formData.productName,
        cost_materials: formData.costMaterials,
        cost_labor: formData.costLabor,
        cost_overhead: formData.costOverhead,
        desired_profit_margin: formData.desiredProfitMargin,
        competitor_prices: competitorPricesArray.length > 0 ? competitorPricesArray : null
      };

      // Llamada real a la API del backend
      const response = await fetch('http://localhost:8000/api/v1/pricing/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResult = await response.json();
      
      // Transformar la respuesta del backend al formato esperado por el frontend
      const transformedResult: PricingResult = {
        recommendedPrice: apiResult.recommended_price,
        costBreakdown: {
          materials: apiResult.cost_breakdown.materials,
          labor: apiResult.cost_breakdown.labor,
          overhead: apiResult.cost_breakdown.overhead,
          totalCost: apiResult.cost_breakdown.total_cost,
          profitAmount: apiResult.cost_breakdown.profit_amount
        },
        profitMargin: apiResult.profit_margin,
        competitiveAnalysis: {
          minPrice: apiResult.competitive_analysis?.min_price,
          maxPrice: apiResult.competitive_analysis?.max_price,
          avgPrice: apiResult.competitive_analysis?.avg_price,
          medianPrice: apiResult.competitive_analysis?.median_price
        },
        pricingStrategies: apiResult.pricing_strategies.map((strategy: {
          name: string;
          price: number;
          description: string;
          pros: string[];
          cons: string[];
        }) => ({
          name: strategy.name,
          price: strategy.price,
          description: strategy.description,
          pros: strategy.pros,
          cons: strategy.cons
        })),
        financialProjections: {
          monthlyRevenue100Units: apiResult.financial_projections.monthly_revenue_100_units,
          monthlyProfit100Units: apiResult.financial_projections.monthly_profit_100_units,
          roiPercentage: apiResult.financial_projections.roi_percentage
        }
      };

      setResult(transformedResult);
      
      // Scroll to results after calculation
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error calculando precio:', error);
      // Fallback a cálculo local si falla el backend
      setResult(fallbackCalculation);
      
      // Scroll to results even on fallback
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, fallbackCalculation]);

  return {
    formData,
    result,
    isLoading,
    errors,
    handleInputChange,
    calculatePricing,
    resetCalculator,
    setFormData
  };
};
