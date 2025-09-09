'use client';

import AdMobDebugPanel from '@/components/AdMobDebugPanel';
import AgeCalculator from '@/components/AgeCalculator/AgeCalculator';
import Footer from '@/components/Footer';
import { useAdMobContext } from '@/providers/AdMobProvider';
import { usePlatform } from '@hooks';
import { useEffect } from 'react';
import styles from './page.module.scss';

export default function Home() {
  const { isMobile, isNative } = usePlatform();
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
    <div className={`${styles.home} ${isNative ? styles.home__native : ''}`}>
      <AdMobDebugPanel />
      <main
        className={`${styles.home__main} ${isMobile ? styles['home__main--mobile'] : ''}`}
      >
        <AgeCalculator />
      </main>
      <Footer />
    </div>
  );
}
