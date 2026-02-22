import React, { createContext, useContext, useState, useCallback } from 'react';
import { translate, SUPPORTED_LANGUAGES } from '../utils/i18n';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'lc_lang';

export const LanguageProvider = ({ children }) => {
    const [lang, setLangState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED_LANGUAGES.find(l => l.code === saved) ? saved : 'en';
    });

    const setLang = useCallback((code) => {
        const valid = SUPPORTED_LANGUAGES.find(l => l.code === code);
        if (valid) {
            localStorage.setItem(STORAGE_KEY, code);
            setLangState(code);
        }
    }, []);

    const t = useCallback((key) => translate(lang, key), [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, languages: SUPPORTED_LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
    return ctx;
};

export default LanguageContext;
