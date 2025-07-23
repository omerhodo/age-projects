'use client';

import AgeCalculator from '@/components/AgeCalculator/AgeCalculator';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import styles from './page.module.scss';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.home}>
      <LanguageSwitcher />
      <main className={styles.home__main}>
        <h1 className={styles.home__title}>{t('home.title')}</h1>
        <p className={styles.home__description}>{t('home.description')}</p>
        <AgeCalculator />
      </main>
    </div>
  );
}
