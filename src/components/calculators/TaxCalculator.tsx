'use client';

import React from 'react';
import { Calculator, Receipt, DollarSign, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { useDarkMode } from '@/hooks/useDarkMode';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { REGIME_DESCRIPTIONS } from '@/lib/calculations/tax';

export const TaxCalculator: React.FC = () => {
  const {
    formData,
    result,
    isLoading,
    errors,
    handleInputChange,
    calculateTaxes,
    resetCalculator
  } = useTaxCalculator();
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="calculator-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto calculator-content">
            <h1 className="hero-title mb-6">
              Calculadora de
              <br />
              <span className="text-red-600">Impuestos</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Calcula impuestos precisos para personas físicas y morales con múltiples regímenes fiscales, 
              retenciones, deducciones y optimización fiscal inteligente
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 -mt-12 calculator-content">
        {/* Input Form */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="glass-card-strong">
            <div className="mb-8 text-center">
              <h2 className="section-title">
                Información del Contribuyente
              </h2>
              <p className="section-subtitle">
                Ingresa los datos para calcular tus impuestos de manera precisa
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                    Nombre Completo *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`apple-input text-center ${errors.name ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="Juan Pérez García"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                    RFC *
                  </label>
                  <input
                    name="rfc"
                    value={formData.rfc}
                    onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                    className={`apple-input text-center ${errors.rfc ? 'border-red-500 animate-shake' : ''}`}
                    placeholder="PEGJ800101ABC"
                    maxLength={13}
                  />
                  {errors.rfc && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.rfc}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="apple-input text-center"
                    placeholder="juan@email.com"
                  />
                </div>
              </div>

              {/* Tipo de Contribuyente y Régimen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Tipo de Contribuyente
                    <HelpTooltip
                      title="Tipo de Contribuyente"
                      content="Persona física: individuos. Persona moral: empresas y organizaciones."
                    />
                  </label>
                  <select
                    name="taxpayerType"
                    value={formData.taxpayerType}
                    onChange={(e) => handleInputChange('taxpayerType', e.target.value)}
                    className="apple-input text-center"
                  >
                    <option value="individual">Persona Física</option>
                    <option value="business">Persona Moral</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Régimen Fiscal
                    <HelpTooltip
                      title="Régimen Fiscal"
                      content={REGIME_DESCRIPTIONS[formData.regime]}
                    />
                  </label>
                  <select
                    name="regime"
                    value={formData.regime}
                    onChange={(e) => handleInputChange('regime', e.target.value)}
                    className="apple-input text-center"
                  >
                    <option value="simplified">Simplificado de Confianza</option>
                    <option value="general">General</option>
                    <option value="wage_earner">Sueldos y Salarios</option>
                    <option value="professional_services">Servicios Profesionales</option>
                  </select>
                </div>
              </div>

              {/* Ingresos */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">💰 Ingresos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Ingreso Mensual ($)
                      <HelpTooltip
                        title="Ingreso Mensual"
                        content="Ingresos brutos mensuales antes de impuestos y deducciones."
                      />
                    </label>
                    <input
                      name="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome || ''}
                      onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.monthlyIncome ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="50000"
                      min="0"
                    />
                    {errors.monthlyIncome && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.monthlyIncome}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Ingreso Anual ($)
                      <HelpTooltip
                        title="Ingreso Anual"
                        content="Ingresos brutos anuales. Se calcula automáticamente si ingresas el mensual."
                      />
                    </label>
                    <input
                      name="annualIncome"
                      type="number"
                      value={formData.annualIncome || ''}
                      onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.annualIncome ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="600000"
                      min="0"
                    />
                    {errors.annualIncome && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.annualIncome}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Deducciones */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">📝 Deducciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Gastos de Negocio ($)
                      <HelpTooltip
                        title="Gastos de Negocio"
                        content="Gastos necesarios para la operación del negocio (solo régimen general)."
                      />
                    </label>
                    <input
                      name="businessExpenses"
                      type="number"
                      value={formData.businessExpenses || ''}
                      onChange={(e) => handleInputChange('businessExpenses', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.businessExpenses ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.businessExpenses && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.businessExpenses}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Gastos Médicos ($)
                      <HelpTooltip
                        title="Gastos Médicos"
                        content="Gastos en salud, medicinas, consultas médicas (máximo 15% del ingreso)."
                      />
                    </label>
                    <input
                      name="medicalExpenses"
                      type="number"
                      value={formData.medicalExpenses || ''}
                      onChange={(e) => handleInputChange('medicalExpenses', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.medicalExpenses ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.medicalExpenses && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.medicalExpenses}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Gastos Educativos ($)
                      <HelpTooltip
                        title="Gastos Educativos"
                        content="Gastos en educación, colegiaturas, cursos (máximo 10% del ingreso)."
                      />
                    </label>
                    <input
                      name="educationalExpenses"
                      type="number"
                      value={formData.educationalExpenses || ''}
                      onChange={(e) => handleInputChange('educationalExpenses', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.educationalExpenses ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.educationalExpenses && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.educationalExpenses}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Intereses Hipotecarios ($)
                      <HelpTooltip
                        title="Intereses Hipotecarios"
                        content="Intereses pagados por crédito hipotecario (máximo 10% del ingreso)."
                      />
                    </label>
                    <input
                      name="mortgageInterest"
                      type="number"
                      value={formData.mortgageInterest || ''}
                      onChange={(e) => handleInputChange('mortgageInterest', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.mortgageInterest ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.mortgageInterest && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.mortgageInterest}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Donaciones ($)
                      <HelpTooltip
                        title="Donaciones"
                        content="Donaciones a instituciones autorizadas (máximo 7% del ingreso)."
                      />
                    </label>
                    <input
                      name="donations"
                      type="number"
                      value={formData.donations || ''}
                      onChange={(e) => handleInputChange('donations', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.donations ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.donations && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.donations}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Otras Deducciones ($)
                      <HelpTooltip
                        title="Otras Deducciones"
                        content="Otras deducciones autorizadas por la ley."
                      />
                    </label>
                    <input
                      name="otherDeductions"
                      type="number"
                      value={formData.otherDeductions || ''}
                      onChange={(e) => handleInputChange('otherDeductions', parseFloat(e.target.value) || 0)}
                      className="apple-input text-center"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* IVA */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">🧾 Impuesto al Valor Agregado (IVA)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      IVA Cobrado ($)
                      <HelpTooltip
                        title="IVA Cobrado"
                        content="IVA que has cobrado a tus clientes por tus servicios o productos."
                      />
                    </label>
                    <input
                      name="vatCollected"
                      type="number"
                      value={formData.vatCollected || ''}
                      onChange={(e) => handleInputChange('vatCollected', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.vatCollected ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.vatCollected && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.vatCollected}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      IVA Pagado ($)
                      <HelpTooltip
                        title="IVA Pagado"
                        content="IVA que has pagado en tus compras y gastos."
                      />
                    </label>
                    <input
                      name="vatPaid"
                      type="number"
                      value={formData.vatPaid || ''}
                      onChange={(e) => handleInputChange('vatPaid', parseFloat(e.target.value) || 0)}
                      className={`apple-input text-center ${errors.vatPaid ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.vatPaid && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.vatPaid}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      Tasa de IVA (%)
                      <HelpTooltip
                        title="Tasa de IVA"
                        content="Tasa de IVA aplicable (por defecto 16%)."
                      />
                    </label>
                    <input
                      name="vatRate"
                      type="number"
                      step="0.01"
                      value={(formData.vatRate * 100).toFixed(2)}
                      onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) / 100)}
                      className={`apple-input text-center ${errors.vatRate ? 'border-red-500 animate-shake' : ''}`}
                      placeholder="16.00"
                      min="0"
                      max="100"
                    />
                    {errors.vatRate && (
                      <p className="text-sm text-red-600 dark:text-red-400 text-center animate-slide-in">{errors.vatRate}</p>
                    )}
                  </div>
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
                  onClick={calculateTaxes}
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
                      Calcular Impuestos
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
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="premium-card animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">ISR a Pagar</h3>
                    <p className="text-gray-300 text-sm">Impuesto Sobre la Renta</p>
                  </div>
                  <Receipt className="w-10 h-10 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.isr.isrToPay)}
                </div>
                <div className="text-sm text-gray-300">
                  Tasa efectiva: {formatPercentage(result.isr.effectiveRate)}
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">IVA a Pagar</h3>
                    <p className="text-gray-300 text-sm">Impuesto al Valor Agregado</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.vat.vatToPay)}
                </div>
                <div className="text-sm text-gray-300">
                  {result.vat.vatToRefund > 0 ? `A favor: ${formatCurrency(result.vat.vatToRefund)}` : 'Sin devolución'}
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Total Impuestos</h3>
                    <p className="text-gray-300 text-sm">Suma de todos los impuestos</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.totalTaxes)}
                </div>
                <div className="text-sm text-gray-300">
                  {formatPercentage((result.totalTaxes / result.breakdown.grossIncome) * 100)} del ingreso
                </div>
              </div>

              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ingreso Neto</h3>
                    <p className="text-gray-300 text-sm">Después de impuestos</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(result.netIncome)}
                </div>
                <div className="text-sm text-gray-300">
                  {formatPercentage((result.netIncome / result.breakdown.grossIncome) * 100)} del ingreso bruto
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ISR Breakdown */}
              <div className="glass-card">
                <div className="mb-8">
                  <h3 className="section-title flex items-center gap-3">
                    <Receipt className="w-6 h-6 text-red-500" />
                    Desglose de ISR
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">Ingreso Gravable</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.isr.taxableIncome)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">ISR Calculado</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.isr.isrCalculated)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">Retenciones</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.isr.isrWithholding)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item bg-slate-100 border-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-slate-600 rounded-full mr-3"></div>
                        <span className="font-bold text-slate-800">ISR a Pagar</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{formatCurrency(result.isr.isrToPay)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* IVA Breakdown */}
              <div className="glass-card">
                <div className="mb-8">
                  <h3 className="section-title flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-500" />
                    Desglose de IVA
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">IVA Cobrado</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.vat.vatCollected)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="font-medium text-slate-700">IVA Pagado</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(result.vat.vatPaid)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cost-breakdown-item bg-slate-100 border-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-slate-600 rounded-full mr-3"></div>
                        <span className="font-bold text-slate-800">IVA a Pagar</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{formatCurrency(result.vat.vatToPay)}</div>
                      </div>
                    </div>
                  </div>
                  {result.vat.vatToRefund > 0 && (
                    <div className="cost-breakdown-item bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-bold text-green-800">IVA a Favor</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-800 text-lg">{formatCurrency(result.vat.vatToRefund)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tax Optimization */}
            {result.taxOptimization.recommendations.length > 0 && (
              <div className="glass-card">
                <div className="mb-8">
                  <h3 className="section-title flex items-center gap-3">
                    <Info className="w-6 h-6 text-purple-500" />
                    Optimización Fiscal
                  </h3>
                  <p className="section-subtitle">
                    Recomendaciones para reducir tus impuestos legalmente
                  </p>
                </div>
                <div className="space-y-4">
                  {result.taxOptimization.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700 dark:text-slate-300">{recommendation}</p>
                    </div>
                  ))}
                  {result.taxOptimization.potentialSavings > 0 && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-green-800 dark:text-green-200">
                          Ahorro Potencial: {formatCurrency(result.taxOptimization.potentialSavings)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
        onExportPDF={() => {
          // TODO: Implementar exportación de impuestos
          alert('Función de exportación en desarrollo');
        }}
        onReset={resetCalculator}
        hasResults={!!result}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
