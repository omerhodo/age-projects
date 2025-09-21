'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { admobConfig } from '../config/env';
import { useAdMob } from '../hooks/useAdMob';
import { usePlatform } from '../hooks/usePlatform';
import { consentService } from '../services/consent.service';
import { useConsent } from './ConsentProvider';

interface AdMobContextType {
  isInitialized: boolean;
  isBannerVisible: boolean;
  isInterstitialReady: boolean;
  isRewardReady: boolean;
  showBanner: () => Promise<void>;
  hideBanner: () => Promise<void>;
  removeBanner: () => Promise<void>;
  showInterstitial: () => Promise<void>;
  showReward: () => Promise<void>;
}

const AdMobContext = createContext<AdMobContextType | undefined>(undefined);

export const useAdMobContext = () => {
  const context = useContext(AdMobContext);
  if (context === undefined) {
    throw new Error('useAdMobContext must be used within an AdMobProvider');
  }
  return context;
};

interface AdMobProviderProps {
  children: React.ReactNode;
}

export const AdMobProvider: React.FC<AdMobProviderProps> = ({ children }) => {
  const { isMobile } = usePlatform();
  const { canShowAdsSync } = useConsent();
  const adMob = useAdMob();
  const [attAllowed, setAttAllowed] = React.useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('../services/app-tracking.service');
        const allowed = await mod.appTrackingService.canShowAds();
        if (mounted) setAttAllowed(allowed);
      } catch (err) {
        console.warn(
          'Unable to determine ATT status, defaulting to allow for non-iOS',
          err
        );
        if (mounted) setAttAllowed(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    let storedConsent: string | null = null;
    if (typeof window !== 'undefined') {
      storedConsent = localStorage.getItem('gdpr_consent');
    }

    const allowForNonPersonalized = storedConsent === 'non_personalized';

    const shouldShowAds =
      isMobile &&
      !admobConfig.testing.disableAds &&
      ((canShowAdsSync && (attAllowed === null ? false : attAllowed)) ||
        allowForNonPersonalized);
    console.log('🚀 AdMob Provider Debug:', {
      isMobile,
      disableAds: admobConfig.testing.disableAds,
      canShowAdsSync,
      shouldShowAds,
      env_disable_ads: process.env.NEXT_PUBLIC_DISABLE_ADS,
      adMobInitialized: adMob.isInitialized,
    });
    setShowAds(shouldShowAds);

    if (shouldShowAds && !adMob.isBannerVisible) {
      adMob
        .showBanner()
        .catch((err) =>
          console.error('❌ AdMobProvider - Failed to auto-show banner:', err)
        );
    }
  }, [
    isMobile,
    canShowAdsSync,
    adMob.isInitialized,
    adMob.isBannerVisible,
    attAllowed,
    adMob,
  ]);

  useEffect(() => {
    const onConsentChanged = (e: Event) => {
      try {
        const ce = e as CustomEvent<{ granted: boolean }>;
        const granted = ce?.detail?.granted;
        if (granted === false) {
          adMob
            .removeBanner()
            .catch((err) =>
              console.error(
                '❌ AdMobProvider - failed to remove banner on consent reset:',
                err
              )
            );
          setShowAds(false);
        }
      } catch (err) {
        console.error('Error handling consent:changed in AdMobProvider', err);
      }
    };

    window.addEventListener('consent:changed', onConsentChanged);
    return () => {
      window.removeEventListener('consent:changed', onConsentChanged);
    };
  }, [adMob]);

  const contextValue: AdMobContextType = {
    ...adMob,
    showBanner: async () => {
      if (showAds) {
        await adMob.showBanner();
        return;
      }

      try {
        const consentSync = consentService.canShowAdsSync();
        const stored =
          typeof window !== 'undefined'
            ? localStorage.getItem('gdpr_consent')
            : null;

        if (
          consentSync ||
          stored === 'granted' ||
          stored === 'non_personalized'
        ) {
          await adMob.showBanner();
        } else {
          console.log(
            'AdMobProvider - no consent detected in fallback, skipping showBanner'
          );
        }
      } catch (err) {
        console.error('AdMobProvider - fallback showBanner failed:', err);
      }
    },
    hideBanner: async () => {
      if (showAds) {
        await adMob.hideBanner();
        return;
      }

      try {
        await adMob.hideBanner();
      } catch (err) {
        console.error('AdMobProvider - fallback hideBanner failed:', err);
      }
    },
    removeBanner: async () => {
      if (showAds) {
        await adMob.removeBanner();
        return;
      }

      try {
        await adMob.removeBanner();
      } catch (err) {
        console.error('AdMobProvider - fallback removeBanner failed:', err);
      }
    },
    showInterstitial: async () => {
      if (showAds && adMob.isInterstitialReady) {
        await adMob.showInterstitial();
      }
    },
    showReward: async () => {
      if (showAds && adMob.isRewardReady) {
        await adMob.showReward();
      }
    },
  };

  return (
    <AdMobContext.Provider value={contextValue}>
      {children}
    </AdMobContext.Provider>
  );
};
