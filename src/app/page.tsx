'use client';

import { useState, lazy, Suspense } from 'react';
import { TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { QuickNavigation } from '@/components/ui/QuickNavigation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

// Lazy loading para mejor rendimiento
const PricingCalculator = lazy(() => import('@/components/calculators/PricingCalculator').then(m => ({ default: m.PricingCalculator })));
const BreakevenCalculator = lazy(() => import('@/components/calculators/BreakevenCalculator').then(m => ({ default: m.BreakevenCalculator })));
const CashflowCalculator = lazy(() => import('@/components/calculators/CashflowCalculator').then(m => ({ default: m.CashflowCalculator })));
const ROICalculator = lazy(() => import('@/components/calculators/ROICalculator').then(m => ({ default: m.ROICalculator })));
const BudgetCalculator = lazy(() => import('@/components/calculators/BudgetCalculator').then(m => ({ default: m.BudgetCalculator })));
const LoanComparatorCalculator = lazy(() => import('@/components/calculators/LoanComparatorCalculator').then(m => ({ default: m.LoanComparatorCalculator })));
const TaxCalculator = lazy(() => import('@/components/calculators/TaxCalculator').then(m => ({ default: m.TaxCalculator })));
const DebtCalculator = lazy(() => import('@/components/calculators/DebtCalculator').then(m => ({ default: m.DebtCalculator })));

type CalculatorType = 'home' | 'pricing' | 'breakeven' | 'cashflow' | 'roi' | 'loan' | 'budget' | 'tax' | 'debt';

export default function Home() {
  const [currentView, setCurrentView] = useState<CalculatorType>('home');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleViewChange = (view: CalculatorType) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  if (currentView === 'pricing') {
    return (
      <main className="min-h-screen">
        {/* Header con botón de volver */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-400 hover:border-blue-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <PricingCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'breakeven') {
    return (
      <main className="min-h-screen">
        {/* Header con botón de volver */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-400 hover:border-green-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <BreakevenCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'cashflow') {
    return (
      <main className="min-h-screen">
        {/* Header con botón de volver */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-400 hover:border-emerald-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <CashflowCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'roi') {
    return (
      <main className="min-h-screen">
        {/* Header con botón de volver */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-400 hover:border-purple-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <ROICalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }
  if (currentView === 'loan') {
    return (
      <main className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-indigo-400 hover:border-indigo-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <LoanComparatorCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'budget') {
    return (
      <main className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-400 hover:border-emerald-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <BudgetCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'tax') {
    return (
      <main className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-400 hover:border-red-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <TaxCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'debt') {
    return (
      <main className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center items-center">
              <button
                onClick={() => handleViewChange('home')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-400 hover:border-green-500"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        </header>
        <div className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <DebtCalculator />
          </Suspense>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Header con solo Dark Mode Toggle */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-end items-center">
            {/* Dark Mode Toggle en esquina superior derecha */}
            <ClientOnly fallback={
              <button className="p-2 text-gray-600 dark:text-gray-400" disabled>
                🔄
              </button>
            }>
              <button
                onClick={toggleDarkMode}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg"
                title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </ClientOnly>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="hero-title mb-8 animate-slide-in">
              Calculadoras
              <br />
              <span className="text-blue-600">Financieras</span>
            </h1>
            
            <p className="hero-subtitle mb-12 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Herramientas inteligentes para emprendedores que buscan 
              tomar decisiones financieras precisas y estratégicas
            </p>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <div className="calculators-section bg-slate-900 dark:bg-slate-900 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Pricing Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-500/50"
                   onClick={() => handleViewChange('pricing')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 mr-4 shadow-lg">
                    <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">
                      Precio Ideal
                    </h3>
                    <p className="font-medium card-subtitle">
                      Producto o Servicio
                    </p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Determina el precio óptimo para tu producto o servicio considerando 
                  costos, competencia y valor percibido por el cliente.
                </p>

                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar cálculo</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">
                    Análisis de costos
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">
                    Competencia
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium badge-purple">
                    Valor percibido
                  </span>
                </div>
              </div>

              {/* Breakeven Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-400/50 dark:hover:border-green-500/50"
                   onClick={() => handleViewChange('breakeven')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 mr-4 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">
                      Punto de Equilibrio
                    </h3>
                    <p className="font-medium card-subtitle">
                      Análisis CVU
                    </p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Descubre cuántas unidades necesitas vender para cubrir todos tus costos 
                  y comenzar a generar ganancias reales.
                </p>

                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar análisis</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-medium badge-red">
                    Costos fijos
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-sm font-medium badge-orange">
                    Costos variables
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">
                    Gráfico CVU
                  </span>
                </div>
              </div>

              {/* Cashflow Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-400/50 dark:hover:border-emerald-500/50"
                   onClick={() => handleViewChange('cashflow')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-emerald-600 dark:text-emerald-400 text-2xl">💵</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">
                      Flujo de Caja Mensual
                    </h3>
                    <p className="font-medium card-subtitle">
                      Caja, burn y runway
                    </p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Calcula tu flujo de caja neto, burn rate y meses de runway con recomendaciones automáticas.
                </p>

                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar cálculo</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">
                    Ingresos/Egresos
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium badge-purple">
                    Burn & Runway
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">
                    Análisis y tips
                  </span>
                </div>
              </div>

              {/* ROI Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-400/50 dark:hover:border-purple-500/50"
                   onClick={() => handleViewChange('roi')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-purple-600 dark:text-purple-400 text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">
                      ROI - Retorno de Inversión
                    </h3>
                    <p className="font-medium card-subtitle">
                      Análisis de rentabilidad
                    </p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Evalúa la rentabilidad de tus inversiones con análisis completo de retorno, 
                  escenarios proyectados y recomendaciones estratégicas.
                </p>

                <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar análisis</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">
                    ROI & NPV
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">
                    Payback Period
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-sm font-medium badge-orange">
                    Escenarios múltiples
                  </span>
                </div>
              </div>
              {/* Loan Comparator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-400/50 dark:hover:border-indigo-500/50"
                   onClick={() => handleViewChange('loan')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-indigo-600 dark:text-indigo-400 text-2xl">🏦</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">Comparador de Préstamos</h3>
                    <p className="font-medium card-subtitle">Cuota, costo y APR</p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Compara ofertas de crédito, calcula cuota, costo total, tiempo de liquidación y revisa tu capacidad de endeudamiento.
                </p>

                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar comparación</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">Cuota mensual</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">Costo total</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium badge-purple">APR aprox</span>
                </div>
              </div>
              {/* Budget Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-400/50 dark:hover:border-emerald-500/50"
                   onClick={() => handleViewChange('budget')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-emerald-600 dark:text-emerald-400 text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">Presupuesto Mensual</h3>
                    <p className="font-medium card-subtitle">Ingresos vs. Gastos</p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Gestiona tu presupuesto personal organizando ingresos y gastos por categorías 
                  con análisis automático y consejos financieros personalizados.
                </p>

                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar presupuesto</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">Categorías custom</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">Análisis automático</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium badge-purple">Consejos inteligentes</span>
                </div>
              </div>

              {/* Tax Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-red-400/50 dark:hover:border-red-500/50"
                   onClick={() => handleViewChange('tax')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-red-600 dark:text-red-400 text-2xl">🧾</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">Calculadora de Impuestos</h3>
                    <p className="font-medium card-subtitle">IVA, ISR, Retenciones</p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Calcula impuestos precisos para personas físicas y morales con múltiples regímenes fiscales, 
                  retenciones, deducciones y optimización fiscal inteligente.
                </p>

                <div className="flex items-center text-red-600 dark:text-red-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Comenzar cálculo</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-medium badge-red">IVA & ISR</span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-sm font-medium badge-orange">Deducciones</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">Optimización</span>
                </div>
              </div>

              {/* Debt Calculator Card */}
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-400/50 dark:hover:border-green-500/50"
                   onClick={() => handleViewChange('debt')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 mr-4 shadow-lg">
                    <span className="w-8 h-8 text-green-600 dark:text-green-400 text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold card-title">Liberación de Deudas</h3>
                    <p className="font-medium card-subtitle">Plan Personalizado</p>
                  </div>
                </div>

                <p className="mb-6 leading-relaxed text-lg card-description">
                  Crea un plan paso a paso para salir de todas tus deudas. Analizamos tu situación y te damos 
                  la estrategia perfecta con cronograma detallado y consejos personalizados.
                </p>

                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">
                  <span>Crear mi plan</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium badge-green">Avalancha</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium badge-blue">Bola de Nieve</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium badge-purple">Personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
