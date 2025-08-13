import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string; // Texto de ayuda contextual mostrado con title
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  tooltip,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-apple-700" title={tooltip}>
          {label}
        </label>
      )}
      <input
        className={cn(
          'apple-input w-full',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        title={tooltip}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-apple-500">{helperText}</p>
      )}
    </div>
  );
};
