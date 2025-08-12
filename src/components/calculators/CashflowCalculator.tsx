"use client";
import React from 'react';
import { useCashflowCalculator } from '@/hooks/useCashflowCalculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CashflowChart } from '@/components/charts/CashflowChart';
import { exportCashflowToHTML, exportCashflowToCSV } from '@/lib/export';

const Money: React.FC<{ value: number }> = ({ value }) => (
  <span className="font-semibold">
    {value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
  </span>
);

export const CashflowCalculator: React.FC = () => {
  const {
    form,
    setForm,
    result,
    isLoading,
    errors,
    addItem,
    removeItem,
    updateItem,
    calculate,
    reset,
  } = useCashflowCalculator();

  const Section: React.FC<{ title: string; field: keyof typeof form }>
    = ({ title, field }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(form[field] as unknown as { name: string; amount: number }[]).map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-7">
                <Input
                  label="Concepto"
                  value={it.name}
                  onChange={(e) => updateItem(field, idx, { name: e.target.value })}
                  placeholder="Ej. Ventas, Renta, Nómina"
                />
              </div>
              <div className="col-span-4">
                <Input
                  label="Monto mensual"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={it.amount === 0 ? '' : it.amount.toString()}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    updateItem(field, idx, { amount: isNaN(val) ? 0 : val });
                  }}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-1">
                <Button variant="ghost" onClick={() => removeItem(field, idx)}>
                  ✕
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={() => addItem(field)}>+ Agregar</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="cashflow-calculator min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">
              Flujo de
              <br />
              <span className="text-emerald-600">Caja Mensual</span>
            </h1>
            
            <p className="hero-subtitle mb-8">
              Analiza tu flujo de caja mensual, burn rate y runway con 
              recomendaciones automáticas para optimizar tu liquidez
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="glass-card-strong">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Caja inicial"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={form.starting_cash === 0 ? '' : form.starting_cash.toString()}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setForm({ ...form, starting_cash: isNaN(val) ? 0 : val });
                  }}
                  error={errors.starting_cash}
                  placeholder="10000"
                />
                <Input
                  label="Impuesto efectivo (0..1)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={form.tax_rate.toString()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setForm({ ...form, tax_rate: isNaN(val) ? 0 : Math.min(1, Math.max(0, val)) });
                  }}
                  error={errors.tax_rate}
                  placeholder="0.15"
                  helperText="Ejemplo: 0.15 para 15%"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Redondeo (decimales)"
                  type="number"
                  min="0"
                  max="6"
                  value={form.round_to.toString()}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setForm({ ...form, round_to: isNaN(val) ? 2 : Math.max(0, Math.min(6, val)) });
                  }}
                  error={errors.round_to}
                  placeholder="2"
                />
              </div>
            </CardContent>
          </Card>

          <Section title="Ingresos" field="revenue" />
          <Section title="Otros Ingresos" field="other_inflows" />
          <Section title="COGS" field="cogs" />
          <Section title="OPEX Fijo" field="opex_fixed" />
          <Section title="OPEX Variable" field="opex_variable" />
          <Section title="Nómina" field="payroll" />
          <Section title="Intereses de Préstamos" field="loan_interest" />
          <Section title="Abonos a Capital" field="loan_principal" />
          <Section title="CapEx" field="capex" />
          <Section title="Otros Egresos" field="other_outflows" />

          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex flex-wrap gap-3 mb-4">
              <Button 
                onClick={calculate} 
                isLoading={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-400 hover:border-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Calculando...' : 'Calcular Flujo de Caja'}
              </Button>
              <Button variant="secondary" onClick={reset} className="px-6 py-3">
                Reiniciar con Ejemplo
              </Button>
            </div>
            
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Errores de validación:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {Object.values(errors).map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" onClick={() => exportCashflowToHTML(result)} className="text-sm">
                  📄 Exportar HTML/PDF
                </Button>
                <Button variant="ghost" onClick={() => exportCashflowToCSV(result)} className="text-sm">
                  📊 Exportar CSV
                </Button>
              </div>
            )}
          </div>
        </div>

        <div id="cashflow-results" className="sticky top-4">
          {result ? (
            <div className="space-y-6">
              <Card className="result-card border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                    📊 Resultados del Flujo de Caja
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-sm text-green-700 dark:text-green-300 mb-1">Total Ingresos</div>
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                        <Money value={result.totals.total_inflows} />
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="text-sm text-red-700 dark:text-red-300 mb-1">Total Egresos</div>
                      <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                        <Money value={result.totals.total_outflows} />
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${result.totals.net_cash_flow >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <div className={`text-sm mb-1 ${result.totals.net_cash_flow >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                        Flujo Neto
                      </div>
                      <div className={`text-2xl font-bold ${result.totals.net_cash_flow >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>
                        <Money value={result.totals.net_cash_flow} />
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="text-sm text-slate-700 dark:text-slate-300 mb-1">Caja Final</div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        <Money value={result.totals.ending_cash} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Flujo Operativo</div>
                      <div className="font-semibold"><Money value={result.totals.operating_cash_flow} /></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">FCF</div>
                      <div className="font-semibold"><Money value={result.totals.free_cash_flow} /></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Runway</div>
                      <div className="font-semibold">
                        {result.totals.runway_months ? `${result.totals.runway_months.toFixed(1)} meses` : '∞'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métricas Analíticas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-orange-500 border-l-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-600">Burn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-700">
                      <Money value={result.totals.burn_rate} />
                    </div>
                    <p className="text-xs text-muted-foreground">Gasto mensual promedio</p>
                  </CardContent>
                </Card>
                
                <Card className={`border-l-4 ${result.totals.runway_months && result.totals.runway_months > 6 ? "border-blue-500" : "border-yellow-500"}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm font-medium ${result.totals.runway_months && result.totals.runway_months > 6 ? "text-blue-600" : "text-yellow-600"}`}>
                      Cash Runway
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${result.totals.runway_months && result.totals.runway_months > 6 ? "text-blue-700" : "text-yellow-700"}`}>
                      {result.totals.runway_months ? `${result.totals.runway_months.toFixed(1)} meses` : '∞'}
                    </div>
                    <p className="text-xs text-muted-foreground">Tiempo hasta agotar efectivo</p>
                  </CardContent>
                </Card>
                
                <Card className={`border-l-4 ${result.totals.operating_cash_flow > 0 ? "border-green-500" : "border-red-500"}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm font-medium ${result.totals.operating_cash_flow > 0 ? "text-green-600" : "text-red-600"}`}>
                      Liquidez Operativa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${result.totals.operating_cash_flow > 0 ? "text-green-700" : "text-red-700"}`}>
                      <Money value={result.totals.operating_cash_flow} />
                    </div>
                    <p className="text-xs text-muted-foreground">Flujo de operaciones</p>
                  </CardContent>
                </Card>
                
                <Card className={`border-l-4 ${result.totals.free_cash_flow > 0 ? "border-emerald-500" : "border-red-500"}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm font-medium ${result.totals.free_cash_flow > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      Flujo de Caja Libre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${result.totals.free_cash_flow > 0 ? "text-emerald-700" : "text-red-700"}`}>
                      <Money value={result.totals.free_cash_flow} />
                    </div>
                    <p className="text-xs text-muted-foreground">FCF después de inversiones</p>
                  </CardContent>
                </Card>
              </div>

              <Card className={`border-l-4 ${
                result.analysis.risk_level === 'low' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                result.analysis.risk_level === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.analysis.risk_level === 'low' ? '✅' : 
                     result.analysis.risk_level === 'medium' ? '⚠️' : '🚨'}
                    Análisis de Riesgo: {result.analysis.risk_level === 'low' ? 'Bajo' : 
                                        result.analysis.risk_level === 'medium' ? 'Medio' : 'Alto'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-slate-700 dark:text-slate-300">{result.analysis.summary}</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">Recomendaciones:</h5>
                    <ul className="space-y-2">
                      {result.analysis.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-blue-500 mt-1">💡</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Ingresos</h4>
                      <ul className="space-y-1">
                        {result.breakdown.inflows.map((i, idx) => (
                          <li key={idx} className="flex justify-between"><span>{i.name}</span><Money value={i.amount} /></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Egresos</h4>
                      <ul className="space-y-1">
                        {result.breakdown.outflows.map((i, idx) => (
                          <li key={idx} className="flex justify-between"><span>{i.name}</span><Money value={i.amount} /></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visualizaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <CashflowChart result={result} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-slate-500">Ingresa datos y presiona Calcular para ver resultados.</div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
