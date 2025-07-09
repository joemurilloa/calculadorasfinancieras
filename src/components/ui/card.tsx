import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('apple-card', className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ className, children }) => {
  return (
    <h3 className={cn('text-title font-semibold text-apple-900', className)}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};
