'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { PricingCalculator } from '@/components/calculators/PricingCalculator';
import { BreakevenCalculator } from '@/components/calculators/BreakevenCalculator';
import { useDarkMode } from '@/hooks/useDarkMode';

type CalculatorType = 'home' | 'pricing' | 'breakeven';

export default function Home() {
  const [currentView, setCurrentView] = useState<CalculatorType>('home');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  if (currentView === 'pricing') {
    return (
      <main className="min-h-screen">
        <PricingCalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => setCurrentView('home')}
            className="apple-button-secondary px-6 py-3"
          >
            ← Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  if (currentView === 'breakeven') {
    return (
      <main className="min-h-screen">
        <BreakevenCalculator />
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => setCurrentView('home')}
            className="apple-button-secondary px-6 py-3"
          >
            ← Volver al inicio
          </button>
        </div>
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
              <button
                onClick={toggleDarkMode}
                className="apple-button-secondary px-8 py-4 text-lg font-semibold"
              >
                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
              </button>
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
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8"
                   onClick={() => setCurrentView('pricing')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-4">
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
              <div className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer p-8"
                   onClick={() => setCurrentView('breakeven')}>
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 mr-4">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
