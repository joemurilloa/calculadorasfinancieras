import React, { useState } from 'react';
import { Plus, Calculator, Download, RefreshCw, Moon, Sun } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewCalculation: () => void;
  onExportPDF: () => void;
  onReset: () => void;
  hasResults: boolean;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewCalculation,
  onExportPDF,
  onReset,
  hasResults,
  onToggleDarkMode,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Calculator,
      label: 'Nueva Calculación',
      action: onNewCalculation,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: isDarkMode ? Sun : Moon,
      label: isDarkMode ? 'Modo Claro' : 'Modo Oscuro',
      action: onToggleDarkMode,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    ...(hasResults ? [
      {
        icon: Download,
        label: 'Exportar PDF',
        action: onExportPDF,
        color: 'bg-purple-600 hover:bg-purple-700'
      }
    ] : []),
    {
      icon: RefreshCw,
      label: 'Resetear',
      action: onReset,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action buttons */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.action();
              setIsOpen(false);
            }}
            className={`
              ${action.color} text-white p-3 rounded-full shadow-lg 
              transition-all duration-200 hover:scale-110
              flex items-center justify-center
              animate-scale-in
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
            title={action.label}
          >
            <action.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-xl
          flex items-center justify-center
          transition-all duration-300
          ${isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          }
          text-white
        `}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
