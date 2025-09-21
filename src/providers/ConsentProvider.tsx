'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { admobConfig } from '../config/env';
import { ConsentInfo, consentService } from '../services/consent.service';

interface ConsentContextType {
  consentInfo: ConsentInfo;
  isInitialized: boolean;
  canShowAds: () => Promise<boolean>;
  canShowAdsSync: boolean;
  showConsentForm: () => Promise<void>;
  showPrivacyOptions: () => Promise<void>;
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

interface ConsentProviderProps {
  children: React.ReactNode;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({
  children,
}) => {
  const [consentInfo, setConsentInfo] = useState<ConsentInfo>({
    consentStatus: 'UNKNOWN',
    formStatus: 'UNKNOWN',
    canRequestAds: false,
    isPrivacyOptionsRequired: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeConsent();
  }, []);

  useEffect(() => {
    const onConsentChanged = () => {
      setConsentInfo(consentService.getConsentInfo());
    };

    window.addEventListener('consent:changed', onConsentChanged);
    return () => {
      window.removeEventListener('consent:changed', onConsentChanged);
    };
  }, []);

  const initializeConsent = async () => {
    try {
      const publisherId = process.env.NEXT_PUBLIC_ADMOB_PUBLISHER_ID;
      if (!publisherId) {
        console.warn('⚠️ No publisher ID found, using test ID');
      }

      await consentService.initialize({
        publisherId: publisherId || 'test-publisher-id',
        debugGeography: admobConfig.testing.isTestingMode
          ? 'DEBUG_GEOGRAPHY_EEA'
          : 'DEBUG_GEOGRAPHY_DISABLED',
        testDeviceIdentifiers: admobConfig.testing.testingDevices,
        tagForUnderAgeOfConsent: false,
      });

      setConsentInfo(consentService.getConsentInfo());
      setIsInitialized(true);

      console.log('✅ Consent Management initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Consent Management:', error);
      setIsInitialized(true); // Hata durumunda da devam et
    }
  };

  const showConsentForm = async () => {
    try {
      await consentService.showConsentForm();
      setConsentInfo(consentService.getConsentInfo());
    } catch (error) {
      console.error('Error showing consent form:', error);
    }
  };

  const showPrivacyOptions = async () => {
    try {
      await consentService.showPrivacyOptionsForm();
      setConsentInfo(consentService.getConsentInfo());
    } catch (error) {
      console.error('Error showing privacy options:', error);
    }
  };

  const resetConsent = () => {
    consentService.resetConsent();
    setConsentInfo(consentService.getConsentInfo());
  };

  const contextValue: ConsentContextType = {
    consentInfo,
    isInitialized,
    canShowAds: () => consentService.canShowAds(),
    canShowAdsSync: consentService.canShowAdsSync(),
    showConsentForm,
    showPrivacyOptions,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};
