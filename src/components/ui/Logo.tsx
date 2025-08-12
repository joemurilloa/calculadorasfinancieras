"use client";
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: { width: 80, height: 24, textSize: 'text-sm' },
  md: { width: 100, height: 30, textSize: 'text-base' },
  lg: { width: 120, height: 36, textSize: 'text-lg' }
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = false, // Cambiado a false por defecto ya que el logo incluye texto
  onClick, 
  className = '' 
}) => {
  const { width, height, textSize } = sizeMap[size];
  
  return (
    <div 
      className={`flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
      onClick={onClick}
    >
      {/* Logo Image */}
      <div className="relative">
        <Image
          src="/logo.png"
          alt="Calculadoras Financieras"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
      
      {/* Logo Text adicional (opcional - ahora oculto por defecto) */}
      {showText && (
        <div className="hidden lg:block">
          <h1 className={`font-bold text-gray-900 dark:text-white ${textSize}`}>
            Calculadoras
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 -mt-1">
            Financieras
          </p>
        </div>
      )}
    </div>
  );
};
