import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, ColorScheme} from './theme';
import {ThemeType} from './types';

interface ThemeContextType {
  theme: ThemeType;
  colors: ColorScheme;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system', colors: Colors.light, setTheme: () => {}, isDark: false,
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setThemeState(saved);
      }
    });
  }, []);

  const isDark = theme === 'system' ? systemScheme === 'dark' : theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, colors, setTheme, isDark}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
