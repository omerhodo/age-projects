'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { admobConfig } from '../config/env';
import { useAdMob } from '../hooks/useAdMob';
import { usePlatform } from '../hooks/usePlatform';

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
  const adMob = useAdMob();
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    const shouldShowAds = isMobile && !admobConfig.testing.disableAds;
    console.log('🚀 AdMob Provider Debug:', {
      isMobile,
      disableAds: admobConfig.testing.disableAds,
      shouldShowAds,
      env_disable_ads: process.env.NEXT_PUBLIC_DISABLE_ADS,
    });
    setShowAds(shouldShowAds);
  }, [isMobile]);

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
