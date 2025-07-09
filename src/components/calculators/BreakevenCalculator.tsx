'use client';

import React from 'react';
import { Calculator, DollarSign, Package, Percent, Shield, FileText } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { useBreakevenCalculator } from '@/hooks/useBreakevenCalculator';
import { useDarkMode } from '@/hooks/useDarkMode';
import { exportBreakevenToPDF } from '@/lib/export';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { BreakevenChart } from '@/components/charts/BreakevenChart';

export const BreakevenCalculator: React.FC = () => {
  const {
    formData,
    result,
    isLoading,
    errors,
    handleInputChange,
    calculateBreakeven,
    resetCalculator
  } = useBreakevenCalculator();
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              Punto de
              <br />
              <span className="text-blue-600">Equilibrio</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Descubre cuántas unidades necesitas vender para cubrir todos tus costos 
              y comenzar a generar ganancias
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
                Información Financiera
              </h2>
              <p className="section-subtitle">
                Ingresa los datos para calcular tu punto de equilibrio
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Costs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Costos Fijos Totales ($)
                    <HelpTooltip
                      title="Costos Fijos Totales"
                      content="Gastos que no cambian con el nivel de producción: alquiler, salarios fijos, seguros, servicios básicos, etc."
                    />
                  </label>
                  <input
                    name="fixedCosts"
                    type="number"
                    value={formData.fixedCosts || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.fixedCosts ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="5000"
                    min="0"
                  />
                  {errors.fixedCosts && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.fixedCosts}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Precio de Venta (por unidad) ($)
                    <HelpTooltip
                      title="Precio de Venta Unitario"
                      content="El precio al que vendes cada unidad de tu producto o servicio a tus clientes."
                    />
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    value={formData.unitPrice || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.unitPrice ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="25"
                    min="0"
                    step="0.01"
                  />
                  {errors.unitPrice && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.unitPrice}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Costo Variable Unitario ($)
                    <HelpTooltip
                      title="Costo Variable Unitario"
                      content="Costo que varía con cada unidad producida: materiales, mano de obra directa, comisiones, etc."
                    />
                  </label>
                  <input
                    name="variableCost"
                    type="number"
                    value={formData.variableCost || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.variableCost ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="10"
                    min="0"
                    step="0.01"
                  />
                  {errors.variableCost && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.variableCost}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Ventas Actuales (unidades) - Opcional
                    <HelpTooltip
                      title="Ventas Actuales"
                      content="Cantidad de unidades que vendes actualmente por período. Usado para calcular el margen de seguridad."
                    />
                  </label>
                  <input
                    name="currentSales"
                    type="number"
                    value={formData.currentSales || ''}
                    onChange={handleInputChange}
                    className={`apple-input text-center ${errors.currentSales ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="1000"
                    min="0"
                  />
                  {errors.currentSales && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.currentSales}</p>
                  )}
                </div>
              </div>
              
              {/* Error Messages */}
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 animate-slide-in">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.general}</p>
                </div>
              )}
              
              {/* Calculate Button */}
              <div className="text-center pt-4">
                <button
                  onClick={calculateBreakeven}
                  disabled={isLoading}
                  className="apple-button-primary px-12 py-5 text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Calculando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Calculator className="w-6 h-6 mr-3" />
                      Calcular Punto de Equilibrio
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
                onClick={() => exportBreakevenToPDF(result, formData)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Descargar Reporte PDF
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="metric-card">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unidades BEP</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {Math.ceil(result.breakevenUnits).toLocaleString()} unidades
                    </p>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 mr-4">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos BEP</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(result.breakevenRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <Percent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Margen Contribución</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatPercentage(result.contributionMarginPercentage)}
                    </p>
                  </div>
                </div>
              </div>

              {result.safetyMarginPercentage !== null && (
                <div className="metric-card">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 mr-4">
                      <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Margen de Seguridad</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formatPercentage(result.safetyMarginPercentage)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="glass-card">
              <div className="mb-8">
                <h3 className="section-title">
                  Gráfico Costos–Volumen–Utilidad
                </h3>
                <p className="section-subtitle">
                  Visualización del punto de equilibrio y zonas de ganancia/pérdida
                </p>
              </div>
              <BreakevenChart result={result} />
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        onNewCalculation={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onExportPDF={() => result && exportBreakevenToPDF(result, formData)}
        onReset={resetCalculator}
        hasResults={!!result}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
