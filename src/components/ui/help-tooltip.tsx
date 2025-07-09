import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  title, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200 p-1"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-scale-in`}>
          <div className="bg-slate-800 dark:bg-slate-900 text-white p-4 rounded-lg shadow-xl max-w-xs border border-slate-700 dark:border-slate-600">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm text-white">{title}</h4>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-slate-200 ml-2 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">{content}</p>
          </div>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};
