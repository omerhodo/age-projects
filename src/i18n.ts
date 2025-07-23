import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import trTranslations from './locales/tr.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  tr: {
    translation: trTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // Default language set to Turkish
    fallbackLng: 'tr',
    debug: process.env.NODE_ENV === 'development',

    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      lookupQuerystring: 'lng',
      caches: ['localStorage', 'cookie'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
