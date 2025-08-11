'use client';

import React from 'react';
import { Calculator, TrendingUp, DollarSign, BarChart3, Sparkles, Target, PieChart, Activity, FileText } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { usePricingCalculator } from '@/hooks/usePricingCalculator';
import { useDarkMode } from '@/hooks/useDarkMode';
import { exportToPDF } from '@/lib/export';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { HelpTooltip } from '@/components/ui/help-tooltip';

export const PricingCalculator: React.FC = () => {
  const {
    formData,
    result,
    isLoading,
    errors,
    handleInputChange,
    calculatePricing,
    resetCalculator
  } = usePricingCalculator();
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              Precio
              <br />
              <span className="text-blue-600">Perfecto</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Descubre el precio ideal para tu producto o servicio con análisis inteligente 
              de costos, competencia y estrategias de mercado
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 -mt-12">
        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card-strong">
            <div className="mb-8 text-center">
              <h2 className="section-title">
                Información del Producto
              </h2>
              <p className="section-subtitle">
                Ingresa los datos para calcular el precio óptimo
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Product Name */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-slate-900 dark:text-slate-100 text-center">
                  Nombre del producto o servicio
                </label>
                <input
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`apple-input text-center ${errors.productName ? 'border-red-500 animate-shake' : ''}`}
                  placeholder="Ej: Consultoría web, Producto digital..."
                />
                {errors.productName && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.productName}</p>
                )}
              </div>
              
              {/* Costs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Materiales ($)
                    <HelpTooltip
                      title="Costo de Materiales"
                      content="Incluye el costo de todas las materias primas, insumos y componentes necesarios para crear tu producto o servicio."
                    />
                  </label>
                  <input
                    name="costMaterials"
                    type="number"
                    value={formData.costMaterials || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.costMaterials ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.costMaterials && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.costMaterials}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Mano de obra ($)
                    <HelpTooltip
                      title="Costo de Mano de Obra"
                      content="Incluye salarios, honorarios y cualquier costo asociado al tiempo y esfuerzo humano necesario para crear tu producto o servicio."
                    />
                  </label>
                  <input
                    name="costLabor"
                    type="number"
                    value={formData.costLabor || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.costLabor ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.costLabor && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.costLabor}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Gastos generales ($)
                    <HelpTooltip
                      title="Gastos Generales"
                      content="Incluye costos indirectos como electricidad, alquiler, seguros, marketing, software, herramientas y otros gastos operativos."
                    />
                  </label>
                  <input
                    name="costOverhead"
                    type="number"
                    value={formData.costOverhead || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.costOverhead ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.costOverhead && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.costOverhead}</p>
                  )}
                </div>
              </div>
              
              {/* Margin and Competitors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Margen de Ganancia Deseado (%)
                    <HelpTooltip
                      title="Margen de Ganancia"
                      content="El porcentaje de beneficio que deseas obtener sobre los costos totales. Un margen del 30% significa que el 30% del precio de venta será ganancia."
                    />
                  </label>
                  <input
                    type="number"
                    name="desiredProfitMargin"
                    value={formData.desiredProfitMargin || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.desiredProfitMargin ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="30"
                    min="0"
                    max="100"
                  />
                  {errors.desiredProfitMargin && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.desiredProfitMargin}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-900 dark:text-slate-100 text-center">
                    Precios de Competencia (opcional)
                  </label>
                  <input
                    type="text"
                    name="competitorPrices"
                    value={formData.competitorPrices}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.competitorPrices ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="Ej: 100, 150, 200"
                  />
                  {errors.competitorPrices && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.competitorPrices}</p>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Separados por comas
                  </p>
                </div>
              </div>
              
              {/* Error Messages */}
              {errors.totalCost && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 animate-slide-in">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.totalCost}</p>
                </div>
              )}
              
              {/* Calculate Button */}
              <div className="text-center pt-4">
                <button
                  onClick={calculatePricing}
                  disabled={isLoading}
                  className="apple-button-primary px-12 py-5 text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Analizando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Calculator className="w-6 h-6 mr-3" />
                      Calcular Precio Ideal
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        {isLoading ? (
          <div id="results-section">
            <LoadingSkeleton />
          </div>
        ) : result && (
          <div id="results-section" className="space-y-12 animate-slide-in">
            {/* Export Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => exportToPDF(result, formData.productName)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Descargar Reporte PDF
              </button>
            </div>
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="premium-card animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Precio Recomendado</h3>
                    <p className="text-gray-300 text-sm">Optimizado para máximo ROI</p>
                  </div>
                  <Target className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.recommendedPrice)}
                </div>
                <div className="text-sm text-gray-300">
                  +{formatPercentage(((result.recommendedPrice - result.costBreakdown.totalCost) / result.costBreakdown.totalCost) * 100)} vs costo
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ganancia Unitaria</h3>
                    <p className="text-gray-300 text-sm">Beneficio por venta</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.costBreakdown.profitAmount)}
                </div>
                <div className="text-sm text-gray-300">
                  Margen: {formatPercentage(result.profitMargin)}
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">ROI Proyectado</h3>
                    <p className="text-gray-300 text-sm">Retorno mensual</p>
                  </div>
                  <Activity className="w-10 h-10 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatPercentage(result.financialProjections.roiPercentage)}
                </div>
                <div className="text-sm text-gray-300">
                  Base: 100 unidades/mes
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cost Breakdown */}
              <div className="glass-card">
                <div className="mb-8">
                  <h3 className="section-title flex items-center gap-3">
                    <PieChart className="w-6 h-6 text-blue-500" />
                    Desglose de Costos
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">Materiales</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(result.costBreakdown.materials)}</div>
                        <div className="text-sm text-slate-500">
                          {formatPercentage((result.costBreakdown.materials / result.costBreakdown.totalCost) * 100)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">Mano de obra</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(result.costBreakdown.labor)}</div>
                        <div className="text-sm text-slate-500">
                          {formatPercentage((result.costBreakdown.labor / result.costBreakdown.totalCost) * 100)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">Gastos generales</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(result.costBreakdown.overhead)}</div>
                        <div className="text-sm text-slate-500">
                          {formatPercentage((result.costBreakdown.overhead / result.costBreakdown.totalCost) * 100)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item bg-slate-100 border-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-slate-600 rounded-full mr-3"></div>
                        <span className="font-bold text-slate-800">Total Costos</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-lg">{formatCurrency(result.costBreakdown.totalCost)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="glass-card">
                <div className="mb-8">
                  <h3 className="section-title flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                    Análisis Competitivo
                  </h3>
                </div>
                {result.competitiveAnalysis.avgPrice ? (
                  <div className="space-y-4">
                    <div className="competitive-insight">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">Precio Mínimo</span>
                        <span className="font-bold text-red-600">{formatCurrency(result.competitiveAnalysis.minPrice || 0)}</span>
                      </div>
                    </div>
                    <div className="competitive-insight">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">Precio Promedio</span>
                        <span className="font-bold text-green-600">{formatCurrency(result.competitiveAnalysis.avgPrice || 0)}</span>
                      </div>
                    </div>
                    <div className="competitive-insight">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">Precio Máximo</span>
                        <span className="font-bold text-blue-600">{formatCurrency(result.competitiveAnalysis.maxPrice || 0)}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 text-center">
                      <div className="text-sm text-slate-600 mb-2">Tu precio vs. competencia</div>
                      <div className="text-2xl font-bold">
                        {result.recommendedPrice > (result.competitiveAnalysis.avgPrice || 0) ? (
                          <span className="text-blue-600">
                            +{formatPercentage(((result.recommendedPrice - (result.competitiveAnalysis.avgPrice || 0)) / (result.competitiveAnalysis.avgPrice || 1)) * 100)} Premium
                          </span>
                        ) : (
                          <span className="text-green-600">
                            -{formatPercentage((((result.competitiveAnalysis.avgPrice || 0) - result.recommendedPrice) / (result.competitiveAnalysis.avgPrice || 1)) * 100)} Competitivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-2">Sin datos de competencia</p>
                    <p className="text-sm text-slate-400">Agrega precios de competidores para un análisis más completo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Strategies */}
            <div className="glass-card">
              <div className="mb-8">
                <h3 className="section-title flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  Estrategias de Precios
                </h3>
                <p className="section-subtitle">
                  Diferentes enfoques según tu objetivo de negocio
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.pricingStrategies.map((strategy, index) => (
                  <div key={index} className="strategy-card">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-slate-900 mb-3">{strategy.name}</h4>
                      <div className="text-3xl font-bold text-blue-600 mb-3">
                        {formatCurrency(strategy.price)}
                      </div>
                      <p className="text-slate-600 mb-4">{strategy.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-green-700 mb-2">✓ Ventajas</h5>
                        <ul className="text-sm text-green-600 space-y-1">
                          {strategy.pros.map((pro, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-red-700 mb-2">⚠ Consideraciones</h5>
                        <ul className="text-sm text-red-600 space-y-1">
                          {strategy.cons.map((con, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Projections */}
            <div className="glass-card">
              <div className="mb-8">
                <h3 className="section-title flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-indigo-500" />
                  Proyecciones Financieras
                </h3>
                <p className="section-subtitle">
                  Estimaciones basadas en 100 unidades mensuales
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-3xl mb-6 inline-block">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-2">Ingresos Mensuales</div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {formatCurrency(result.financialProjections.monthlyRevenue100Units)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatCurrency(result.recommendedPrice)} × 100 unidades
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl mb-6 inline-block">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-2">Ganancia Mensual</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(result.financialProjections.monthlyProfit100Units)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {formatCurrency(result.costBreakdown.profitAmount)} × 100 unidades
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-3xl mb-6 inline-block">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-2">ROI Mensual</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatPercentage(result.financialProjections.roiPercentage)}
                  </div>
                  <div className="text-sm text-slate-500">
                    Retorno sobre inversión
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        onNewCalculation={() => {
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onExportPDF={() => result && exportToPDF(result, formData.productName)}
        onReset={resetCalculator}
        hasResults={!!result}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
