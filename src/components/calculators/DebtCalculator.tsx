'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Plus, 
  Trash2, 
  Calculator,
  Target,
  Calendar,
  PiggyBank,
  Lightbulb
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { useDebtCalculator } from '@/hooks/useDebtCalculator';
import { useDarkMode } from '@/hooks/useDarkMode';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { DEBT_TYPES, STRATEGY_DESCRIPTIONS } from '@/lib/calculations/debt';

export const DebtCalculator: React.FC = () => {
  const {
    debts,
    monthlyIncome,
    extraPayment,
    selectedStrategy,
    customPriorities,
    analysis,
    paymentPlan,
    isLoading,
    errors,
    addDebt,
    updateDebt,
    removeDebt,
    calculatePaymentPlan,
    updateCustomPriority,
    resetCalculator,
    setMonthlyIncome,
    setExtraPayment,
    setSelectedStrategy,
    getTotalDebt,
    getTotalMinimumPayments,
    getDebtToIncomeRatio,
    canAffordExtraPayment
  } = useDebtCalculator();
  
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
    type: 'credit_card' as const
  });

  const handleAddDebt = () => {
    if (addDebt(newDebt)) {
      setNewDebt({
        name: '',
        balance: 0,
        interestRate: 0,
        minimumPayment: 0,
        type: 'credit_card'
      });
      setShowAddDebt(false);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'avalanche': return 'text-red-600 dark:text-red-400';
      case 'snowball': return 'text-blue-600 dark:text-blue-400';
      case 'custom': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'avalanche': return '⚡';
      case 'snowball': return '';
      case 'custom': return '🎯';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              Calculadora de
              <br />
              <span className="text-green-600">Liberación de Deudas</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Crea un plan personalizado para salir de tus deudas de manera eficiente. 
              Analizamos todas tus deudas y te damos la estrategia perfecta para tu situación.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 -mt-12">
        {/* Income and Extra Payment */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="glass-card-strong">
            <div className="mb-8 text-center">
              <h2 className="section-title">
                Tu Situación Financiera
              </h2>
              <p className="section-subtitle">
                Ingresa tu ingreso mensual y cuánto extra puedes pagar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Ingreso Mensual ($)
                  <HelpTooltip
                    title="Ingreso Mensual"
                    content="Tu ingreso neto mensual después de impuestos y deducciones obligatorias."
                  />
                </label>
                <input
                  type="number"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  className="apple-input text-center"
                  placeholder="5000"
                  min="0"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Pago Extra Disponible ($)
                  <HelpTooltip
                    title="Pago Extra"
                    content="Dinero adicional que puedes pagar cada mes después de cubrir tus gastos básicos y pagos mínimos."
                  />
                </label>
                <input
                  type="number"
                  value={extraPayment || ''}
                  onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                  className="apple-input text-center"
                  placeholder="500"
                  min="0"
                />
              </div>
            </div>

            {/* Income Analysis */}
            {monthlyIncome > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingreso Mensual</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(monthlyIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pagos Mínimos</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(getTotalMinimumPayments())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Disponible para Deudas</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(monthlyIncome - getTotalMinimumPayments())}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Debt Form */}
        {showAddDebt && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="glass-card-strong">
              <div className="mb-8 text-center">
                <h2 className="section-title">
                  Agregar Nueva Deuda
                </h2>
                <p className="section-subtitle">
                  Ingresa los detalles de tu deuda
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                      Nombre de la Deuda *
                    </label>
                    <input
                      type="text"
                      value={newDebt.name}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, name: e.target.value }))}
                      className="apple-input"
                      placeholder="Ej: Tarjeta Visa, Préstamo Personal"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                      Tipo de Deuda
                    </label>
                    <select
                      value={newDebt.type}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, type: e.target.value as any }))}
                      className="apple-input"
                    >
                      {Object.entries(DEBT_TYPES).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                      Saldo Actual ($) *
                    </label>
                    <input
                      type="number"
                      value={newDebt.balance || ''}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                      className="apple-input"
                      placeholder="5000"
                      min="0"
                    />
                    {errors.balance && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.balance}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                      Tasa de Interés (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newDebt.interestRate || ''}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                      className="apple-input"
                      placeholder="18.99"
                      min="0"
                      max="100"
                    />
                    {errors.interestRate && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.interestRate}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                      Pago Mínimo ($) *
                    </label>
                    <input
                      type="number"
                      value={newDebt.minimumPayment || ''}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, minimumPayment: parseFloat(e.target.value) || 0 }))}
                      className="apple-input"
                      placeholder="150"
                      min="0"
                    />
                    {errors.minimumPayment && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.minimumPayment}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleAddDebt}
                    className="apple-button-primary px-8 py-3"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Deuda
                  </button>
                  <button
                    onClick={() => setShowAddDebt(false)}
                    className="apple-button-secondary px-8 py-3"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debts List */}
        {debts.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="glass-card-strong">
              <div className="mb-8 text-center">
                <h2 className="section-title">
                  Tus Deudas ({debts.length})
                </h2>
                <p className="section-subtitle">
                  Total: {formatCurrency(getTotalDebt())} • Pagos mínimos: {formatCurrency(getTotalMinimumPayments())}
                </p>
              </div>
              
              <div className="space-y-4">
                {debts.map((debt, index) => (
                  <div key={debt.id} className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {DEBT_TYPES[debt.type].icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {debt.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {DEBT_TYPES[debt.type].name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(debt.balance)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatPercentage(debt.interestRate)} • Mín: {formatCurrency(debt.minimumPayment)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Strategy Selection */}
        {debts.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="glass-card-strong">
              <div className="mb-8 text-center">
                <h2 className="section-title">
                  Estrategia de Pago
                </h2>
                <p className="section-subtitle">
                  Elige cómo quieres priorizar tus pagos
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(STRATEGY_DESCRIPTIONS).map(([key, strategy]) => (
                  <div
                    key={key}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStrategy === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedStrategy(key as any)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">
                        {getStrategyIcon(key)}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {strategy.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {strategy.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs">
                          <p className="font-semibold text-green-600 dark:text-green-400">Ventajas:</p>
                          <ul className="text-slate-600 dark:text-slate-400">
                            {strategy.pros.map((pro, index) => (
                              <li key={index}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold text-orange-600 dark:text-orange-400">Consideraciones:</p>
                          <ul className="text-slate-600 dark:text-slate-400">
                            {strategy.cons.map((con, index) => (
                              <li key={index}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {debts.length > 0 && (
          <div className="text-center mb-16">
            <button
              onClick={calculatePaymentPlan}
              disabled={isLoading || !canAffordExtraPayment()}
              className="apple-button-primary px-12 py-5 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Calculando Plan...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Calculator className="w-6 h-6 mr-3" />
                  Crear Mi Plan de Liberación
                </div>
              )}
            </button>
            
            {!canAffordExtraPayment() && extraPayment > 0 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-4">
                ⚠️ Tu pago extra excede el dinero disponible después de pagos mínimos
              </p>
            )}
          </div>
        )}

        {/* Add Debt Button */}
        {!showAddDebt && (
          <div className="text-center mb-16">
            <button
              onClick={() => setShowAddDebt(true)}
              className="apple-button-secondary px-8 py-4 text-lg font-semibold"
            >
              <Plus className="w-6 h-6 mr-3" />
              Agregar Deuda
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {isLoading ? (
          <div id="results-section">
            <LoadingSkeleton />
          </div>
        ) : paymentPlan && analysis && (
          <div id="results-section" className="space-y-12 animate-slide-in">
            {/* Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="premium-card animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Tiempo de Liberación</h3>
                    <p className="text-gray-300 text-sm">Meses para estar libre de deudas</p>
                  </div>
                  <Calendar className="w-10 h-10 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {paymentPlan.monthsToFreedom}
                </div>
                <div className="text-sm text-gray-300">
                  {Math.floor(paymentPlan.monthsToFreedom / 12)} años {paymentPlan.monthsToFreedom % 12} meses
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ahorro en Intereses</h3>
                    <p className="text-gray-300 text-sm">Dinero que ahorrarás</p>
                  </div>
                  <PiggyBank className="w-10 h-10 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(paymentPlan.savings)}
                </div>
                <div className="text-sm text-gray-300">
                  {formatPercentage((paymentPlan.savings / paymentPlan.totalDebt) * 100)} del total
                </div>
              </div>
              
              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Pago Mensual Total</h3>
                    <p className="text-gray-300 text-sm">Incluyendo pago extra</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-4">
                  {formatCurrency(paymentPlan.monthlyPayment)}
                </div>
                <div className="text-sm text-gray-300">
                  +{formatCurrency(paymentPlan.extraPayment)} extra
                </div>
              </div>

              <div className="premium-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Estrategia</h3>
                    <p className="text-gray-300 text-sm">Método seleccionado</p>
                  </div>
                  <Target className="w-10 h-10 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-4">
                  {getStrategyIcon(paymentPlan.strategy)} {STRATEGY_DESCRIPTIONS[paymentPlan.strategy].name}
                </div>
                <div className="text-sm text-gray-300">
                  {STRATEGY_DESCRIPTIONS[paymentPlan.strategy].description}
                </div>
              </div>
            </div>

            {/* Strategy Explanation */}
            <div className="glass-card">
              <div className="mb-8">
                <h3 className="section-title flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  Tu Plan Personalizado
                </h3>
                <p className="section-subtitle">
                  {paymentPlan.explanation}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  💡 Consejos para tu éxito:
                </h4>
                <ul className="space-y-2">
                  {paymentPlan.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Schedule Preview */}
            <div className="glass-card">
              <div className="mb-8">
                <h3 className="section-title flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  Cronograma de Pagos (Primeros 12 meses)
                </h3>
                <p className="section-subtitle">
                  Ve cómo se verán tus pagos mes a mes
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Mes</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Deuda</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Pago</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Principal</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Interés</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Saldo Restante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentPlan.payments.slice(0, 12).map((payment, index) => (
                      <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{payment.month}</td>
                        <td className="py-3 px-4 text-slate-900 dark:text-slate-100">{payment.debtName}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(payment.payment)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                          {payment.isPaidOff ? (
                            <span className="text-green-600 dark:text-green-400 font-semibold">¡PAGADA!</span>
                          ) : (
                            formatCurrency(payment.remainingBalance)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        onExportPDF={() => {
          // TODO: Implementar exportación de plan de deudas
          alert('Función de exportación en desarrollo');
        }}
        onReset={resetCalculator}
        hasResults={!!paymentPlan}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
