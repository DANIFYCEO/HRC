// ThemeContext - Global theme state management (dark/light mode)

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, LightColors } from '../constants/Colors';
import { Config } from '../constants/Config';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  colors: typeof Colors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark theme
  const [colors, setColors] = useState(Colors);

  // Load theme preference from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update colors when theme changes
  useEffect(() => {
    setColors(theme === 'dark' ? Colors : LightColors);
  }, [theme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(Config.storageKeys.theme);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(Config.storageKeys.theme, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  const value = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
