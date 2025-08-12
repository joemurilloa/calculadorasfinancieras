'use client';

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Inicializar en false para evitar discrepancias de hidratación
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Leer la preferencia guardada o iniciar en modo claro por defecto
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
      } else {
        // Si no hay preferencia guardada, iniciar en modo claro
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', JSON.stringify(false));
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
