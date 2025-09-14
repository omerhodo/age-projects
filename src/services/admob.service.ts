import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { admobConfig } from '../config/env';
import { appTrackingService } from './app-tracking.service';

export class AdMobService {
  private static instance: AdMobService;
  private isInitialized = false;

  public static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  private constructor() {}

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔧 AdMob already initialized');
      return;
    }

    console.log('🚀 Initializing AdMob with config:', {
      testingDevices: admobConfig.testing.testingDevices,
      initializeForTesting: admobConfig.testing.initializeForTesting,
      isTestingMode: admobConfig.testing.isTestingMode,
    });

    try {
      // Check ATT status on iOS before initializing AdMob
      const canShowPersonalizedAds = await appTrackingService.canShowAds();
      console.log('🍎 Can show personalized ads:', canShowPersonalizedAds);

      await AdMob.initialize({
        testingDevices: admobConfig.testing.testingDevices,
        initializeForTesting: admobConfig.testing.initializeForTesting,
      });

      this.isInitialized = true;
      console.log('✅ AdMob initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing AdMob:', error);
      throw error;
    }
  }

  private getPlatform(): 'ios' | 'android' {
    const platform = Capacitor.getPlatform();
    return platform === 'ios' ? 'ios' : 'android';
  }

  private getAdIds() {
    return admobConfig.adIds;
  }

  async showBanner(
    position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER
  ): Promise<void> {
    if (!this.isInitialized) {
      console.log('🔧 AdMob not initialized, initializing...');
      await this.initialize();
    }

    const platform = this.getPlatform();
    const adIds = this.getAdIds();

    const safeAreaMargin = platform === 'ios' ? 60 : 80;

    const options: BannerAdOptions = {
      adId: adIds[platform].banner,
      adSize: BannerAdSize.BANNER,
      position: position,
      margin: safeAreaMargin,
      isTesting: admobConfig.testing.isTestingMode,
    };

    console.log('🚀 Showing banner ad with options:', {
      platform,
      adId: options.adId,
      isTesting: options.isTesting,
      position: options.position,
      margin: options.margin,
      safeAreaAdjustment: `${safeAreaMargin}px for ${platform}`,
    });

    try {
      await AdMob.showBanner(options);
      console.log('✅ Banner ad shown successfully');
    } catch (error) {
      console.error('❌ Error showing banner ad:', error);
      throw error;
    }
  }

  async hideBanner(): Promise<void> {
    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden successfully');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }

  async removeBanner(): Promise<void> {
    try {
      await AdMob.removeBanner();
      console.log('Banner ad removed successfully');
    } catch (error) {
      console.error('Error removing banner ad:', error);
    }
  }

  async prepareInterstitial(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const platform = this.getPlatform();
    const adIds = this.getAdIds();
    const options = {
      adId: adIds[platform].interstitial,
      isTesting: admobConfig.testing.isTestingMode,
    };

    try {
      await AdMob.prepareInterstitial(options);
      console.log('Interstitial ad prepared successfully');
    } catch (error) {
      console.error('Error preparing interstitial ad:', error);
    }
  }

  async showInterstitial(): Promise<void> {
    try {
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown successfully');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }

  async prepareReward(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const platform = this.getPlatform();
    const adIds = this.getAdIds();
    const options: RewardAdOptions = {
      adId: adIds[platform].reward,
      isTesting: admobConfig.testing.isTestingMode,
    };

    try {
      await AdMob.prepareRewardVideoAd(options);
      console.log('Reward ad prepared successfully');
    } catch (error) {
      console.error('Error preparing reward ad:', error);
    }
  }

  async showReward(): Promise<void> {
    try {
      await AdMob.showRewardVideoAd();
      console.log('Reward ad shown successfully');
    } catch (error) {
      console.error('Error showing reward ad:', error);
    }
  }
}

export const adMobService = AdMobService.getInstance();
