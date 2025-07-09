import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'red' | 'yellow';
  delay?: string;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
    light: 'bg-blue-50 border-blue-200'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    text: 'text-green-600',
    light: 'bg-green-50 border-green-200'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    light: 'bg-purple-50 border-purple-200'
  },
  indigo: {
    bg: 'from-indigo-500 to-indigo-600',
    text: 'text-indigo-600',
    light: 'bg-indigo-50 border-indigo-200'
  },
  red: {
    bg: 'from-red-500 to-red-600',
    text: 'text-red-600',
    light: 'bg-red-50 border-red-200'
  },
  yellow: {
    bg: 'from-yellow-500 to-yellow-600',
    text: 'text-yellow-600',
    light: 'bg-yellow-50 border-yellow-200'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color, 
  delay = '0s' 
}) => {
  const colors = colorClasses[color];
  
  return (
    <div 
      className="kpi-card animate-scale-in" 
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
          <div className={`text-3xl font-bold ${colors.text}`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors.bg} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-1">
            {trend.isPositive ? '↗' : '↘'}
          </span>
          {trend.value}
        </div>
      )}
    </div>
  );
};
