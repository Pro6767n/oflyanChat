import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {LanguageType} from './types';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'az', setLanguage: () => {},
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {i18n} = useTranslation();
  const [language, setLanguageState] = useState<LanguageType>('az');

  useEffect(() => {
    AsyncStorage.getItem('language').then(saved => {
      if (saved && (saved === 'az' || saved === 'tr' || saved === 'en')) {
        setLanguageState(saved as LanguageType);
        i18n.changeLanguage(saved);
      }
    });
  }, [i18n]);

  const setLanguage = async (lang: LanguageType) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
