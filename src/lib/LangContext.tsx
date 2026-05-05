import React, { createContext, useContext, useState } from 'react';
import { Lang, t } from './i18n';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'ru',
  setLang: () => {},
  tr: (k) => k,
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('ru');
  const tr = (key: string) => t[lang][key] ?? t['en'][key] ?? key;
  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
