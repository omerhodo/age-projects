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
  private debugEvents: Array<{ ts: number; event: string; details?: unknown }> =
    [];

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
      this.pushDebug('initialize.start', { testing: admobConfig.testing });
      const canShowPersonalizedAds = await appTrackingService.canShowAds();
      this.pushDebug('initialize.attCheck', { canShowPersonalizedAds });
      console.log('🍎 Can show personalized ads:', canShowPersonalizedAds);

      await AdMob.initialize({
        testingDevices: admobConfig.testing.testingDevices,
        initializeForTesting: admobConfig.testing.initializeForTesting,
      });

      this.isInitialized = true;
      this.pushDebug('initialize.success');
      console.log('✅ AdMob initialized successfully');
    } catch (error) {
      this.pushDebug('initialize.error', { error });
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

    this.pushDebug('showBanner.request', { platform, adId: options.adId });
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
      this.pushDebug('showBanner.success', { adId: options.adId });
      console.log('✅ Banner ad shown successfully');
    } catch (error) {
      this.pushDebug('showBanner.error', { error, adId: options.adId });
      console.error('❌ Error showing banner ad:', error);
      throw error;
    }
  }

  async hideBanner(): Promise<void> {
    try {
      this.pushDebug('hideBanner.request');
      await AdMob.hideBanner();
      this.pushDebug('hideBanner.success');
      console.log('Banner ad hidden successfully');
    } catch (error) {
      this.pushDebug('hideBanner.error', { error });
      console.error('Error hiding banner ad:', error);
    }
  }

  async removeBanner(): Promise<void> {
    try {
      this.pushDebug('removeBanner.request');
      await AdMob.removeBanner();
      this.pushDebug('removeBanner.success');
      console.log('Banner ad removed successfully');
    } catch (error) {
      this.pushDebug('removeBanner.error', { error });
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
      this.pushDebug('prepareInterstitial.request', { adId: options.adId });
      await AdMob.prepareInterstitial(options);
      this.pushDebug('prepareInterstitial.success', { adId: options.adId });
      console.log('Interstitial ad prepared successfully');
    } catch (error) {
      this.pushDebug('prepareInterstitial.error', { error });
      console.error('Error preparing interstitial ad:', error);
    }
  }

  async showInterstitial(): Promise<void> {
    try {
      this.pushDebug('showInterstitial.request');
      await AdMob.showInterstitial();
      this.pushDebug('showInterstitial.success');
      console.log('Interstitial ad shown successfully');
    } catch (error) {
      this.pushDebug('showInterstitial.error', { error });
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
      this.pushDebug('prepareReward.request', { adId: options.adId });
      await AdMob.prepareRewardVideoAd(options);
      this.pushDebug('prepareReward.success', { adId: options.adId });
      console.log('Reward ad prepared successfully');
    } catch (error) {
      this.pushDebug('prepareReward.error', { error });
      console.error('Error preparing reward ad:', error);
    }
  }

  async showReward(): Promise<void> {
    try {
      this.pushDebug('showReward.request');
      await AdMob.showRewardVideoAd();
      this.pushDebug('showReward.success');
      console.log('Reward ad shown successfully');
    } catch (error) {
      this.pushDebug('showReward.error', { error });
      console.error('Error showing reward ad:', error);
    }
  }

  private pushDebug(event: string, details?: unknown) {
    try {
      const ts = Date.now();
      this.debugEvents.push({ ts, event, details });
      if (this.debugEvents.length > 200) this.debugEvents.shift();
      if (process.env.NODE_ENV !== 'production') {
        console.debug(
          `AdMobTrace ${new Date(ts).toISOString()} - ${event}`,
          details || ''
        );
      }
    } catch {
      // ignore
    }
  }

  public getDebugEvents() {
    return [...this.debugEvents];
  }
}

export const adMobService = AdMobService.getInstance();
