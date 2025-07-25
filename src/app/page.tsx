'use client';

import AgeCalculator from '@/components/AgeCalculator/AgeCalculator';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { usePlatform } from '@hooks';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';

export default function Home() {
  const { t } = useTranslation();
  const { isMobile } = usePlatform();

  return (
    <div className={styles.home}>
      <LanguageSwitcher />
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
