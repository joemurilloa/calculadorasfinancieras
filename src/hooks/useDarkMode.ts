'use client';

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Inicializar estado desde localStorage inmediatamente si está disponible
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        const isDark = JSON.parse(savedMode);
        // Aplicar la clase inmediatamente para evitar parpadeo
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return isDark;
      }
    }
    // Modo claro por defecto
    return false;
  });

  useEffect(() => {
    // Solo ejecutar si no se pudo obtener del localStorage en la inicialización
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        const savedIsDark = JSON.parse(savedMode);
        if (savedIsDark !== isDarkMode) {
          setIsDarkMode(savedIsDark);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Aplicar o remover la clase 'dark' del documento
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar preferencia en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
};
