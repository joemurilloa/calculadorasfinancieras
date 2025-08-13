"use client";
import React from 'react';
import { useBudgetCalculator } from '@/hooks/useBudgetCalculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetCharts } from '@/components/charts/BudgetCharts';
import { Plus, Trash2, Copy, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

// Funciones helper para formateo de números
const formatNumberWithCommas = (num: number): string => {
  if (num === 0) return '0';
  return num.toLocaleString('en-US');
};

const parseNumberFromFormatted = (str: string): number => {
  if (!str || str.trim() === '') return 0;
  return parseFloat(str.replace(/,/g, '')) || 0;
};

export const BudgetCalculator: React.FC = () => {
  const { 
    form, 
    result, 
    loading, 
    errors, 
    calculate, 
    addItem, 
    updateItem, 
    removeItem, 
    reset, 
    duplicateItem,
    incomeCategories,
    expenseCategories
  } = useBudgetCalculator();

  const incomes = form.items.filter(item => item.type === 'income');
  const expenses = form.items.filter(item => item.type === 'expense');

  return (
    <div className="min-h-screen">
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              Calculadora de<br />
              <span className="text-emerald-600">Presupuesto Mensual</span>
            </h1>
            <p className="hero-subtitle mb-8">
              Controla tus finanzas personales comparando ingresos vs gastos. 
              Identifica gastos innecesarios, determina tu capacidad de ahorro y evita el sobreendeudamiento.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sección de Ingresos */}
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <TrendingUp className="w-5 h-5" />
                  Ingresos Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {incomes.map((income) => (
                    <div key={income.id} className="grid grid-cols-12 gap-4 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="col-span-12 md:col-span-4">
                        <Input
                          label="Nombre del ingreso"
                          value={income.name}
                          onChange={e => updateItem(income.id, { name: e.target.value })}
                          error={errors[`name_${form.items.indexOf(income)}`]}
                          placeholder="Ej: Salario principal"
                          tooltip="Describe la fuente de este ingreso"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoría
                        </label>
                        <select
                          value={income.category}
                          onChange={e => updateItem(income.id, { category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        >
                          {incomeCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <Input
                          label="Monto mensual"
                          type="text"
                          value={formatNumberWithCommas(income.amount)}
                          onChange={e => updateItem(income.id, { amount: parseNumberFromFormatted(e.target.value) })}
                          error={errors[`amount_${form.items.indexOf(income)}`]}
                          placeholder="5,000"
                          tooltip="Cantidad que recibes mensualmente"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2 flex items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateItem(income.id)}
                          className="p-2"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(income.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="secondary"
                    onClick={() => addItem('income')}
                    className="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Ingreso
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sección de Gastos */}
            <Card>
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <TrendingDown className="w-5 h-5" />
                  Gastos Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="grid grid-cols-12 gap-4 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="col-span-12 md:col-span-3">
                        <Input
                          label="Nombre del gasto"
                          value={expense.name}
                          onChange={e => updateItem(expense.id, { name: e.target.value })}
                          error={errors[`name_${form.items.indexOf(expense)}`]}
                          placeholder="Ej: Alquiler"
                          tooltip="Describe en qué gastas este dinero"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoría
                        </label>
                        <select
                          value={expense.category}
                          onChange={e => updateItem(expense.id, { category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        >
                          {expenseCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <Input
                          label="Monto mensual"
                          type="text"
                          value={formatNumberWithCommas(expense.amount)}
                          onChange={e => updateItem(expense.id, { amount: parseNumberFromFormatted(e.target.value) })}
                          error={errors[`amount_${form.items.indexOf(expense)}`]}
                          placeholder="1,200"
                          tooltip="Cantidad que gastas mensualmente"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo
                        </label>
                        <select
                          value={expense.isEssential ? 'essential' : 'optional'}
                          onChange={e => updateItem(expense.id, { isEssential: e.target.value === 'essential' })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="essential">Esencial</option>
                          <option value="optional">Opcional</option>
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-2 flex items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateItem(expense.id)}
                          className="p-2"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(expense.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="secondary"
                    onClick={() => addItem('expense')}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Gasto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={calculate} 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {loading ? 'Calculando...' : 'Calcular Presupuesto'}
              </Button>
              <Button variant="secondary" onClick={reset}>
                Reiniciar
              </Button>
            </div>

            {/* Errores */}
            {Object.keys(errors).length > 0 && (
              <Card className="border-red-300 bg-red-50 dark:bg-red-900/30">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <ul className="text-sm text-red-800 dark:text-red-300 list-disc ml-3">
                      {Object.values(errors).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resultados */}
          <div className="space-y-6 sticky top-4">
            {result ? (
              <>
                {/* Resumen rápido */}
                <Card className={`border-2 ${
                  result.summary.balance >= 0 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <CardHeader>
                    <CardTitle className={`${
                      result.summary.balance >= 0 
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.analysis.status === 'surplus' && '✅ Presupuesto Positivo'}
                      {result.analysis.status === 'deficit' && '⚠️ Presupuesto en Déficit'}
                      {result.analysis.status === 'balanced' && '⚖️ Presupuesto Balanceado'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Balance mensual:</span>
                        <span className={`font-bold ${
                          result.summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {result.summary.balance >= 0 ? '+' : ''}${result.summary.balance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de ahorro:</span>
                        <span className="font-semibold">
                          {result.summary.savingsRate.toFixed(1)}%
                        </span>
                      </div>
                      {result.analysis.emergencyFundMonths !== undefined && result.analysis.emergencyFundMonths > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Fondo de emergencia:</span>
                          <span className="font-semibold text-blue-600">
                            {result.analysis.emergencyFundMonths} meses
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Análisis y recomendaciones */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Análisis Financiero</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.analysis.insights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">📊 Insights</h4>
                        <ul className="space-y-1">
                          {result.analysis.insights.map((insight, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">💡 Recomendaciones</h4>
                      <ul className="space-y-2">
                        {result.analysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Analiza tu presupuesto
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Agrega tus ingresos y gastos para obtener un análisis detallado de tu situación financiera.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gráficos completos */}
        {result && (
          <div className="mt-12">
            <BudgetCharts result={result} />
          </div>
        )}
      </div>
    </div>
  );
};
