'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { admobConfig } from '../config/env';
import { useAdMob } from '../hooks/useAdMob';
import { usePlatform } from '../hooks/usePlatform';
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
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    const shouldShowAds =
      isMobile && !admobConfig.testing.disableAds && canShowAdsSync;
    console.log('🚀 AdMob Provider Debug:', {
      isMobile,
      disableAds: admobConfig.testing.disableAds,
      canShowAdsSync,
      shouldShowAds,
      env_disable_ads: process.env.NEXT_PUBLIC_DISABLE_ADS,
      adMobInitialized: adMob.isInitialized,
    });
    setShowAds(shouldShowAds);

    if (shouldShowAds && adMob.isInitialized && !adMob.isBannerVisible) {
      adMob
        .showBanner()
        .catch((err) =>
          console.error('❌ AdMobProvider - Failed to auto-show banner:', err)
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, canShowAdsSync, adMob.isInitialized, adMob.isBannerVisible]);

  const contextValue: AdMobContextType = {
    ...adMob,
    showBanner: async () => {
      if (showAds) {
        await adMob.showBanner();
      }
    },
    hideBanner: async () => {
      if (showAds) {
        await adMob.hideBanner();
      }
    },
    removeBanner: async () => {
      if (showAds) {
        await adMob.removeBanner();
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
