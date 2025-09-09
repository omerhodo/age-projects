'use client';

import { useAdMob } from '@/hooks/useAdMob';
import { consentService } from '@/services/consent.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConsentBanner.module.scss';

const ConsentBanner = () => {
  const { t } = useTranslation();
  const { showBanner } = useAdMob();
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    setTimeout(() => {
      try {
        const consent = localStorage.getItem('simple_consent');
        console.log('🎯 ConsentBanner - localStorage consent:', consent);
        console.log('🎯 ConsentBanner - isClient:', true);

        if (!consent) {
          setShowConsentBanner(true);
          console.log('✅ ConsentBanner - Showing banner');
        } else {
          console.log('🚫 ConsentBanner - Consent already given:', consent);
        }
      } catch (error) {
        console.error('❌ ConsentBanner - localStorage error:', error);
        setShowConsentBanner(true);
      }
    }, 100);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleAccept = async () => {
    try {
      localStorage.setItem('simple_consent', 'true');
      consentService.setConsent(true);
      await showBanner();

      setShowConsentBanner(false);
      console.log('✅ Consent accepted and ads started');
    } catch (error) {
      console.error('❌ Error starting ads:', error);
      setShowConsentBanner(false);
    }
  };

  const handleReject = () => {
    localStorage.setItem('simple_consent', 'false');
    consentService.setConsent(false);
    setShowConsentBanner(false);
    console.log('❌ Consent rejected');
  };

  // Debug için: Banner'ı her zaman göster (geçici)
  console.log('🔍 ConsentBanner - showConsentBanner:', showConsentBanner);
  console.log('🔍 ConsentBanner - isClient:', isClient);

  // Normal çalışma modu - showConsentBanner state'ini kullan
  const shouldShowBanner = showConsentBanner;

  if (!shouldShowBanner) {
    console.log('🚫 ConsentBanner - Not showing banner');
    return null;
  }

  console.log('✅ ConsentBanner - Rendering banner');

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h3>{t('consentBanner.title')}</h3>
          <p>{t('consentBanner.description')}</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.rejectBtn} onClick={handleReject}>
            {t('consentBanner.rejectButton')}
          </button>
          <button className={styles.acceptBtn} onClick={handleAccept}>
            {t('consentBanner.acceptButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
