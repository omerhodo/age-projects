'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (!storedLang || (storedLang !== 'tr' && storedLang !== 'en')) {
      i18n.changeLanguage('tr');
      localStorage.setItem('i18nextLng', 'tr');
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
