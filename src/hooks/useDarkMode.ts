'use client';

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Inicializar en false para evitar discrepancias de hidratación
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Solo después de hidratar, leer del localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        const savedIsDark = JSON.parse(savedMode);
        setIsDarkMode(savedIsDark);
        // Aplicar inmediatamente la clase
        if (savedIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    // Solo aplicar cambios después de la hidratación inicial
    if (isHydrated) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Guardar preferencia en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      }
    }
  }, [isDarkMode, isHydrated]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode, isHydrated };
};
