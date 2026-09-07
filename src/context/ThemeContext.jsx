import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_EDITORIAL = {
  id: 'editorial',
  name: 'Warm Editorial',
  description: 'Classic Library with Amber, Espresso & Warm Cream',
  accent: '#d97706',
  bg: 'bg-[#faf7f2]',
  navBg: 'bg-[#1c1917]',
  previewColor: 'from-amber-600 via-amber-500 to-yellow-500',
  isDark: false
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme] = useState('editorial');

  useEffect(() => {
    localStorage.setItem('library_theme', 'editorial');
    document.documentElement.setAttribute('data-theme', 'editorial');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'editorial', currentTheme: THEME_EDITORIAL }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
