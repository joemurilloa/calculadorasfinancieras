"use client";
import React from 'react';
import { useLoanComparator } from '@/hooks/useLoanComparator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoanAmortizationChart } from '@/components/charts/LoanAmortizationChart';

// Funciones helper para formateo de números
const formatNumberWithCommas = (num: number): string => {
  if (num === 0) return '0';
  return num.toLocaleString('en-US');
};

const parseNumberFromFormatted = (str: string): number => {
  if (!str || str.trim() === '') return 0;
  return parseFloat(str.replace(/,/g, '')) || 0;
};

const Currency: React.FC<{ value: number }> = ({ value }) => <span className="font-bold text-gray-900 dark:text-slate-100">${formatNumberWithCommas(value)}</span>;
const Percent: React.FC<{ value: number }> = ({ value }) => <span className="font-bold text-gray-900 dark:text-slate-100">{value.toFixed(2)}%</span>;

export const LoanComparatorCalculator: React.FC = () => {
  const { form, updateLoan, addLoan, removeLoan, result, calculate, loading, errors, setForm, reset } = useLoanComparator();

  return (
    <div className="min-h-screen">
      <section className="hero-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-title mb-6">Comparador de<br /><span className="text-indigo-600">Préstamos</span></h1>
            <p className="hero-subtitle mb-8">Evalúa múltiples ofertas de crédito: cuota, costo total, tiempo de pago, APR aproximada y tu ratio deuda/ingreso para elegir la opción más inteligente.</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contexto del Usuario</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ingreso mensual"
                  type="text"
                  value={formatNumberWithCommas(form.user.monthlyIncome)}
                  onChange={e=> setForm(prev=>({...prev,user:{...prev.user,monthlyIncome:parseNumberFromFormatted(e.target.value)}}))}
                  error={errors.monthlyIncome}
                  placeholder="8,000"
                  tooltip="Suma total de ingresos netos mensuales (después de impuestos)."
                />
                <Input
                  label="Otras deudas mensuales"
                  type="text"
                  value={formatNumberWithCommas(form.user.otherMonthlyDebt)}
                  onChange={e=> setForm(prev=>({...prev,user:{...prev.user,otherMonthlyDebt:parseNumberFromFormatted(e.target.value)}}))}
                  placeholder="500"
                  tooltip="Pago total mensual de otras obligaciones (tarjetas, préstamos, etc.)."
                />
              </CardContent>
            </Card>

            {form.loans.map((l, idx) => (
              <Card key={l.id} className="relative border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{l.name}</span>
                    {form.loans.length > 1 && (
                      <button onClick={()=>removeLoan(l.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Nombre" value={l.name} onChange={e=>updateLoan(l.id,{name:e.target.value})} tooltip="Etiqueta para identificar esta oferta de préstamo." />
                  <Input label="Monto" type="text" value={formatNumberWithCommas(l.amount)} onChange={e=>updateLoan(l.id,{amount:parseNumberFromFormatted(e.target.value)})} error={errors[`amount_${idx}`]} tooltip="Cantidad de dinero que solicitas (principal)." placeholder="100,000" />
                  <Input label="Tasa anual (%)" type="number" step="0.01" value={(l.annualRate*100).toFixed(2)} onChange={e=>updateLoan(l.id,{annualRate:(parseFloat(e.target.value)||0)/100})} error={errors[`rate_${idx}`]} tooltip="Tasa de interés nominal anual del préstamo (sin incluir comisiones)." />
                  <Input label="Plazo (meses)" type="number" value={l.termMonths} onChange={e=>updateLoan(l.id,{termMonths:parseInt(e.target.value)||0})} error={errors[`term_${idx}`]} tooltip="Duración del préstamo en meses hasta pagar el saldo." />
                  <Input label="Comisión %" type="number" step="0.01" value={(l.originationFeePct*100).toFixed(2)} onChange={e=>updateLoan(l.id,{originationFeePct:(parseFloat(e.target.value)||0)/100})} tooltip="Comisión de apertura expresada como porcentaje del monto (si aplica)." />
                  <Input label="Comisión fija" type="text" value={formatNumberWithCommas(l.originationFeeFlat)} onChange={e=>updateLoan(l.id,{originationFeeFlat:parseNumberFromFormatted(e.target.value)})} tooltip="Comisión de apertura fija en moneda local." placeholder="1,000" />
                  <Input label="Pago extra" type="text" value={formatNumberWithCommas(l.extraMonthlyPayment)} onChange={e=>updateLoan(l.id,{extraMonthlyPayment:parseNumberFromFormatted(e.target.value)})} tooltip="Cantidad adicional que planeas abonar cada mes para acelerar el pago." placeholder="500" />
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={addLoan}>+ Agregar oferta</Button>
              <Button onClick={calculate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? 'Calculando...' : 'Comparar Préstamos'}
              </Button>
              <Button variant="ghost" onClick={reset}>Reiniciar</Button>
            </div>

            {Object.keys(errors).length > 0 && (
              <Card className="border-red-300 bg-red-50 dark:bg-red-900/30">
                <CardContent className="pt-4">
                  <ul className="text-sm text-red-800 dark:text-red-300 list-disc ml-5">
                    {Object.values(errors).map((e,i)=><li key={i}>{e}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resultados */}
          <div className="space-y-6 sticky top-4">
            {result ? (
              <>
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800">
                  <CardHeader className="bg-indigo-50 dark:bg-indigo-900/30">
          <CardTitle className="text-gray-900 dark:text-slate-100 font-bold">Resumen Comparativo</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4 text-gray-900 dark:text-slate-100">
                    <div className="overflow-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
              <tr className="text-left border-b border-slate-200 dark:border-slate-700 text-gray-900 dark:text-slate-200">
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Préstamo</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Pago</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Pago+Extra</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Interés</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Costo Total</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">APR</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Meses</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">Meses c/Extra</th>
                            <th className="py-2 pr-4 font-bold text-gray-900 dark:text-slate-100">DTI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.loans.map(l => {
                            const highlight = l.id === result.bestByTotalCost || l.id === result.bestByLowestPayment || l.id === result.bestByFastestPayoff;
                            return (
                <tr key={l.id} className={(highlight ? 'bg-indigo-100/70 dark:bg-indigo-900/20 ' : '') + 'text-gray-900 dark:text-slate-100'}>
                                <td className="py-1 pr-4 font-medium text-gray-900 dark:text-slate-100">{l.name}</td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100"><Currency value={l.monthlyPayment} /></td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100"><Currency value={l.monthlyPaymentWithExtra} /></td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100"><Currency value={l.totalInterest} /></td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100"><Currency value={l.totalCost} /></td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100"><Percent value={l.aprApprox} /></td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100">{l.payoffMonths}</td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100">{l.payoffMonthsWithExtra}</td>
                                <td className="py-1 pr-4 text-gray-900 dark:text-slate-100">{(l.dti*100).toFixed(1)}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
          <div className="text-xs text-gray-900 dark:text-slate-400 font-medium">APR aproximada estimada: incluye interés + comisiones. Para decisiones formales solicita la CAT/APR oficial de la institución.</div>
                  </CardContent>
                </Card>

        <Card className="border-l-4 border-indigo-500 bg-white dark:bg-slate-800">
                  <CardHeader>
          <CardTitle className="text-gray-900 dark:text-slate-100 font-bold">Análisis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-900 dark:text-slate-100">
          <p className="text-sm mb-4 text-gray-900 dark:text-slate-300 font-medium">{result.analysisSummary}</p>
                    <ul className="space-y-2">
                      {result.recommendations.map((r,i)=>(
            <li key={i} className="flex items-start gap-2 text-sm text-gray-900 dark:text-slate-300 font-medium">
                          <span className="text-indigo-500 mt-0.5">💡</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-black dark:text-slate-100">Amortización (mejor costo)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoanAmortizationChart data={result.selectedSchedule} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🏦</div>
                  <h3 className="text-xl font-semibold mb-2">Compara tus préstamos</h3>
                  <p className="text-slate-600 dark:text-slate-400">Agrega o ajusta ofertas y presiona &quot;Comparar Préstamos&quot; para ver resultados detallados.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
