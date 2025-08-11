'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { PricingCalculator } from '@/components/calculators/PricingCalculator';
import { BreakevenCalculator } from '@/components/calculators/BreakevenCalculator';
import { CashflowCalculator } from '@/components/calculators/CashflowCalculator';
import { ROICalculator } from '@/components/calculators/ROICalculator';
import { QuickNavigation } from '@/components/ui/QuickNavigation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { ClientOnly } from '@/components/ui/ClientOnly';

type CalculatorType = 'home' | 'pricing' | 'breakeven' | 'cashflow' | 'roi';

export default function Home() {
  const [currentView, setCurrentView] = useState<CalculatorType>('home');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleViewChange = (view: CalculatorType) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentView === 'pricing') {
    return (
      <main className="min-h-screen">
        <PricingCalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => handleViewChange('home')}
            className="apple-button-secondary px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            ← Volver al inicio
          </button>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'breakeven') {
    return (
      <main className="min-h-screen">
        <BreakevenCalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => handleViewChange('home')}
            className="apple-button-secondary px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            ← Volver al inicio
          </button>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'cashflow') {
    return (
      <main className="min-h-screen">
        <CashflowCalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => handleViewChange('home')}
            className="apple-button-secondary px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            ← Volver al inicio
          </button>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  if (currentView === 'roi') {
    return (
      <main className="min-h-screen">
        <ROICalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => handleViewChange('home')}
            className="apple-button-secondary px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            ← Volver al inicio
          </button>
        </div>
        <QuickNavigation currentView={currentView} onViewChange={handleViewChange} />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">
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

            {/* Dark Mode Toggle */}
            <div className="flex justify-center mb-12 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <ClientOnly fallback={
                <button className="apple-button-secondary px-8 py-4 text-lg font-semibold bg-gray-100 dark:bg-gray-800 rounded-full shadow-lg" disabled>
                  🔄 Cargando...
                </button>
              }>
                <button
                  onClick={toggleDarkMode}
                  className="apple-button-secondary px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                </button>
              </ClientOnly>
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
