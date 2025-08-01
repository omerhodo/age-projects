'use client';

import AdMobDebugPanel from '@/components/AdMobDebugPanel';
import AgeCalculator from '@/components/AgeCalculator/AgeCalculator';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useAdMobContext } from '@/providers/AdMobProvider';
import { usePlatform } from '@hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';

export default function Home() {
  const { t } = useTranslation();
  const { isMobile } = usePlatform();
  const { isInitialized, showBanner } = useAdMobContext();

  useEffect(() => {
    if (isInitialized && isMobile) {
      const timer = setTimeout(() => {
        showBanner();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isMobile, showBanner]);

  return (
    <div className={styles.home}>
      <LanguageSwitcher />
      <AdMobDebugPanel />
      <main
        className={`${styles.home__main} ${isMobile ? styles['home__main--mobile'] : ''}`}
      >
        <h1 className={styles.home__title}>{t('home.title')}</h1>
        <p className={styles.home__description}>{t('home.description')}</p>
        <AgeCalculator />
      </main>
      <Footer />
    </div>
  );
}
