import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface SuccessMessageProps {
  productName: string;
  recommendedPrice: number;
  onClose: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  productName, 
  recommendedPrice, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Precio Calculado!
          </h2>
          
          <p className="text-slate-600 mb-6">
            El precio ideal para <strong>{productName}</strong> ha sido calculado exitosamente.
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
            <div className="text-sm text-green-700 font-medium mb-1">Precio Recomendado</div>
            <div className="text-3xl font-bold text-green-600">
              ${recommendedPrice.toLocaleString()}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="apple-button-primary w-full"
          >
            Ver Análisis Completo
          </button>
        </div>
      </div>
    </div>
  );
};
