'use client';

import { useAdMobContext } from '@/providers/AdMobProvider';
import { consentService } from '@/services/consent.service';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConsentBanner.module.scss';

const ConsentBanner = () => {
  const { t } = useTranslation();
  const { showBanner } = useAdMobContext();
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
        } else if (consent === 'non_personalized') {
          console.log(
            'ℹ️ ConsentBanner - Non-personalized consent found, starting general ads'
          );
          showBanner().catch((err) =>
            console.error(
              '❌ ConsentBanner - Error starting non-personalized ads on mount:',
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

    const onConsentChanged = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail || {};
        if (detail.granted === true || detail.nonPersonalized === true) {
          setShowConsentBanner(false);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('consent:show-form', onShowForm);
    window.addEventListener(
      'consent:show-privacy-options',
      onShowPrivacyOptions
    );
    window.addEventListener(
      'consent:changed',
      onConsentChanged as EventListener
    );

    return () => {
      window.removeEventListener('consent:show-form', onShowForm);
      window.removeEventListener(
        'consent:show-privacy-options',
        onShowPrivacyOptions
      );
      window.removeEventListener(
        'consent:changed',
        onConsentChanged as EventListener
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
    // User chose to see general (non-personalized) ads
    try {
      consentService.setNonPersonalizedConsent();
      showBanner().catch((err) =>
        console.error(
          '❌ ConsentBanner - Error starting non-personalized ads:',
          err
        )
      );
    } catch (err) {
      console.error(
        '❌ ConsentBanner - Failed to set non-personalized consent',
        err
      );
    }

    setShowConsentBanner(false);
    console.log('ℹ️ User opted for general (non-personalized) ads');
  };

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
