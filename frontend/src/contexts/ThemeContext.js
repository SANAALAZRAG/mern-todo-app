import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Vérifier si l'utilisateur a déjà choisi un thème
  const storedTheme = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(storedTheme === 'dark');

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Mettre à jour les classes CSS et le localStorage lorsque le mode change
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};