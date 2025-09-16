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
        const consent = localStorage.getItem('gdpr_consent');
        console.log('🎯 ConsentBanner - localStorage gdpr_consent:', consent);
        console.log('🎯 ConsentBanner - isClient:', true);

        if (!consent) {
          setShowConsentBanner(true);
          console.log('✅ ConsentBanner - Showing banner (no stored consent)');
        } else if (consent === 'granted') {
          console.log(
            '✅ ConsentBanner - Consent already granted, starting ads'
          );
          showBanner().catch((err) =>
            console.error(
              '❌ ConsentBanner - Error starting ads on mount:',
              err
            )
          );
        } else {
          console.log(
            '🚫 ConsentBanner - Consent already denied or not granted:',
            consent
          );
        }
      } catch (error) {
        console.error('❌ ConsentBanner - localStorage error:', error);
        setShowConsentBanner(true);
      }
    }, 100);
  }, [showBanner]);

  useEffect(() => {
    const onShowForm = () => {
      setShowConsentBanner(true);
    };

    const onShowPrivacyOptions = () => {
      setShowConsentBanner(true);
    };

    window.addEventListener('consent:show-form', onShowForm);
    window.addEventListener(
      'consent:show-privacy-options',
      onShowPrivacyOptions
    );

    return () => {
      window.removeEventListener('consent:show-form', onShowForm);
      window.removeEventListener(
        'consent:show-privacy-options',
        onShowPrivacyOptions
      );
    };
  }, []);

  if (!isClient) {
    return null;
  }

  const handleAccept = async () => {
    try {
      localStorage.setItem('gdpr_consent', 'granted');
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
    localStorage.setItem('gdpr_consent', 'denied');
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
          <p className={styles.description}>{t('consentBanner.description')}</p>
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
