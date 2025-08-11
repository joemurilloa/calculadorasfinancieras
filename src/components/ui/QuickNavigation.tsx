'use client';

import { DollarSign, TrendingUp, ArrowLeftRight, BarChart3 } from 'lucide-react';

interface QuickNavigationProps {
  currentView: string;
  onViewChange: (view: 'pricing' | 'breakeven' | 'cashflow' | 'roi' | 'home') => void;
}

export function QuickNavigation({ currentView, onViewChange }: QuickNavigationProps) {
  const calculators = [
    { id: 'pricing', name: 'Precio', icon: DollarSign, color: 'blue' },
    { id: 'breakeven', name: 'Equilibrio', icon: TrendingUp, color: 'green' },
    { id: 'cashflow', name: 'Flujo', icon: ArrowLeftRight, color: 'emerald' },
    { id: 'roi', name: 'ROI', icon: BarChart3, color: 'purple' }
  ];

  if (currentView === 'home') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            const isActive = currentView === calc.id;
            
            return (
              <button
                key={calc.id}
                onClick={() => onViewChange(calc.id as 'pricing' | 'breakeven' | 'cashflow' | 'roi' | 'home')}
                className={`
                  p-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? `bg-${calc.color}-100 dark:bg-${calc.color}-900/30 text-${calc.color}-600 dark:text-${calc.color}-400 scale-110` 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105'
                  }
                `}
                title={calc.name}
              >
                <Icon className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {calc.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
