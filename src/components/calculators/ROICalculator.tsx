"use client";
import React from 'react';
import { useROICalculator } from '@/hooks/useROICalculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROIChart } from '../charts/ROIChart';
import { exportROIToHTML, exportROIToCSV } from '@/lib/export';

const Money: React.FC<{ value: number }> = ({ value }) => (
  <span className="font-semibold">
    ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </span>
);

const Percentage: React.FC<{ value: number | null | undefined }> = ({ value }) => (
  <span className="font-semibold">
    {typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : '0.00'}%
  </span>
);

export const ROICalculator: React.FC = () => {
  const {
    formData,
    result,
    loading,
    errors,
    calculateROI,
    updateInvestment,
    updateReturns,
    updateParameters,
    resetForm
  } = useROICalculator();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              ROI - Retorno de
              <br />
              <span className="text-purple-600">Inversión</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Evalúa la rentabilidad de tus inversiones con análisis completo de retorno, 
              escenarios proyectados y recomendaciones estratégicas para la toma de decisiones
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Entrada */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Datos de Inversión */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Inversión Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monto Inicial *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.investment.initial_amount}
                    onChange={(e) => updateInvestment('initial_amount', parseFloat(e.target.value) || 0)}
                    className={errors.initial_amount ? 'border-red-500' : ''}
                    placeholder="Ej: 25000"
                  />
                  {errors.initial_amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.initial_amount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Costos Adicionales
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.investment.additional_costs}
                    onChange={(e) => updateInvestment('additional_costs', parseFloat(e.target.value) || 0)}
                    className={errors.additional_costs ? 'border-red-500' : ''}
                    placeholder="Ej: 2500"
                  />
                  {errors.additional_costs && (
                    <p className="text-red-500 text-sm mt-1">{errors.additional_costs}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Inversión *
                </label>
                <Input
                  type="date"
                  value={formData.investment.investment_date}
                  onChange={(e) => updateInvestment('investment_date', e.target.value)}
                  className={errors.investment_date ? 'border-red-500' : ''}
                />
                {errors.investment_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.investment_date}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Retornos Esperados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Retornos Esperados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aumento Mensual de Ingresos
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.returns.monthly_revenue_increase}
                    onChange={(e) => updateReturns('monthly_revenue_increase', parseFloat(e.target.value) || 0)}
                    className={errors.monthly_revenue_increase ? 'border-red-500' : ''}
                    placeholder="Ej: 4500"
                  />
                  {errors.monthly_revenue_increase && (
                    <p className="text-red-500 text-sm mt-1">{errors.monthly_revenue_increase}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ahorro Mensual en Costos
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.returns.monthly_cost_savings}
                    onChange={(e) => updateReturns('monthly_cost_savings', parseFloat(e.target.value) || 0)}
                    className={errors.monthly_cost_savings ? 'border-red-500' : ''}
                    placeholder="Ej: 1200"
                  />
                  {errors.monthly_cost_savings && (
                    <p className="text-red-500 text-sm mt-1">{errors.monthly_cost_savings}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Valor Residual (al final del período)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.returns.residual_value}
                  onChange={(e) => updateReturns('residual_value', parseFloat(e.target.value) || 0)}
                  className={errors.residual_value ? 'border-red-500' : ''}
                  placeholder="Ej: 5000"
                />
                {errors.residual_value && (
                  <p className="text-red-500 text-sm mt-1">{errors.residual_value}</p>
                )}
              </div>
              {errors.returns && (
                <p className="text-red-500 text-sm">{errors.returns}</p>
              )}
            </CardContent>
          </Card>

          {/* Parámetros de Análisis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ Parámetros de Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Período (meses)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.parameters.analysis_period_months}
                    onChange={(e) => updateParameters('analysis_period_months', parseInt(e.target.value) || 12)}
                    className={errors.analysis_period_months ? 'border-red-500' : ''}
                    placeholder="24"
                  />
                  {errors.analysis_period_months && (
                    <p className="text-red-500 text-sm mt-1">{errors.analysis_period_months}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tasa de Descuento (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={(formData.parameters.discount_rate * 100).toFixed(2)}
                    onChange={(e) => updateParameters('discount_rate', (parseFloat(e.target.value) || 0) / 100)}
                    className={errors.discount_rate ? 'border-red-500' : ''}
                    placeholder="12.00"
                  />
                  {errors.discount_rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.discount_rate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Inflación (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={(formData.parameters.inflation_rate * 100).toFixed(2)}
                    onChange={(e) => updateParameters('inflation_rate', (parseFloat(e.target.value) || 0) / 100)}
                    className={errors.inflation_rate ? 'border-red-500' : ''}
                    placeholder="4.00"
                  />
                  {errors.inflation_rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.inflation_rate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={calculateROI} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold animate-pulse-glow"
            >
              {loading ? 'Calculando...' : '📈 Calcular ROI'}
            </Button>
            <Button variant="secondary" onClick={resetForm}>
              🔄 Limpiar
            </Button>
          </div>

          {/* Errores Generales */}
          {errors.general && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{errors.general}</p>
              </CardContent>
            </Card>
          )}

          {/* Botones de Exportación */}
          {result && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="ghost" onClick={() => exportROIToHTML(result)} className="text-sm">
                📄 Exportar HTML/PDF
              </Button>
              <Button variant="ghost" onClick={() => exportROIToCSV(result)} className="text-sm">
                📊 Exportar CSV
              </Button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div id="roi-results" className="sticky top-4">
          {result ? (
            <div className="space-y-6">
              {/* Métricas Principales */}
              <Card className="result-card border-2 border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-900/20">
                  <CardTitle className="text-xl text-green-900 dark:text-green-100">
                    📈 Métricas de ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-4 rounded-lg ${result.metrics.simple_roi >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className={`text-sm mb-1 ${result.metrics.simple_roi >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        ROI Simple
                      </div>
                      <div className={`text-2xl font-bold ${result.metrics.simple_roi >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        <Percentage value={result.metrics.simple_roi} />
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">ROI Anualizado</div>
                      <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        <Percentage value={result.metrics.annualized_roi} />
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-sm text-orange-700 dark:text-orange-300 mb-1">Payback Period</div>
                      <div className="text-xl font-bold text-orange-800 dark:text-orange-200">
                        {result.metrics.payback_period_months ? 
                          `${result.metrics.payback_period_months.toFixed(1)} meses` : 
                          'No se recupera'
                        }
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${result.metrics.npv >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className={`text-sm mb-1 ${result.metrics.npv >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                        Valor Presente Neto
                      </div>
                      <div className={`text-xl font-bold ${result.metrics.npv >= 0 ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}`}>
                        <Money value={result.metrics.npv} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Inversión Total</div>
                      <div className="font-semibold"><Money value={result.metrics.total_investment} /></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Retornos Totales</div>
                      <div className="font-semibold"><Money value={result.metrics.total_returns} /></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Ganancia Neta</div>
                      <div className="font-semibold"><Money value={result.metrics.profit} /></div>
                    </div>
                    {result.metrics.irr && (
                      <div className="text-center">
                        <div className="text-sm text-slate-600 dark:text-slate-400">TIR</div>
                        <div className="font-semibold"><Percentage value={result.metrics.irr * 100} /></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Análisis y Recomendaciones */}
              <Card className={`border-l-4 ${
                result.analysis.risk_level === 'low' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                result.analysis.risk_level === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.analysis.investment_grade === 'excellent' ? '🌟' :
                     result.analysis.investment_grade === 'good' ? '✅' :
                     result.analysis.investment_grade === 'fair' ? '⚠️' :
                     result.analysis.investment_grade === 'poor' ? '📉' : '🚨'}
                    Análisis de Inversión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.analysis.investment_grade === 'excellent' ? 'bg-green-200 text-green-800' :
                      result.analysis.investment_grade === 'good' ? 'bg-blue-200 text-blue-800' :
                      result.analysis.investment_grade === 'fair' ? 'bg-yellow-200 text-yellow-800' :
                      result.analysis.investment_grade === 'poor' ? 'bg-orange-200 text-orange-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {result.analysis.investment_grade === 'excellent' ? 'Excelente' :
                       result.analysis.investment_grade === 'good' ? 'Buena' :
                       result.analysis.investment_grade === 'fair' ? 'Regular' :
                       result.analysis.investment_grade === 'poor' ? 'Pobre' : 'Evitar'}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {result.analysis.recommendation}
                    </p>
                    <div className="space-y-2">
                      <h5 className="font-semibold text-slate-800 dark:text-slate-200">Insights Clave:</h5>
                      <ul className="space-y-2">
                        {result.analysis.key_insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <span className="text-blue-500 mt-1">💡</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escenarios */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Análisis de Escenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(result.scenarios).map(([key, scenario]) => (
                      <div key={key} className={`p-4 rounded-lg border ${
                        key === 'pessimistic' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                        key === 'realistic' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' :
                        'border-green-200 bg-green-50 dark:bg-green-900/20'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{scenario.scenario_name}</span>
                          <span className={`text-lg font-bold ${
                            scenario.roi_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <Percentage value={scenario.roi_percentage} />
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          NPV: <Money value={scenario.npv} /> | 
                          Payback: {scenario.payback_months ? `${scenario.payback_months.toFixed(1)} meses` : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico */}
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>📈 Proyección Temporal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ROIChart data={result} />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Analiza tu ROI</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Completa los datos de inversión y retornos para obtener un análisis completo
                  de rentabilidad con proyecciones y recomendaciones.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
