import { BannerAdPosition } from '@capacitor-community/admob';
import { useRef, useState } from 'react';
import { adMobService } from '../services/admob.service';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isInterstitialReady, setIsInterstitialReady] = useState(false);
  const [isRewardReady, setIsRewardReady] = useState(false);
  const isShowingRef = useRef(false);

  const showBanner = async (
    position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER
  ) => {
    if (isBannerVisible) {
      console.log('useAdMob - showBanner called but banner already visible');
      return;
    }
    if (isShowingRef.current) {
      console.log(
        'useAdMob - showBanner called while show in progress, ignoring'
      );
      return;
    }
    isShowingRef.current = true;
    try {
      await adMobService.showBanner(position);
      setIsInitialized(true);
      setIsBannerVisible(true);
      prepareInterstitial();
      prepareReward();
    } catch (err) {
      console.error('Failed to show banner:', err);
    } finally {
      isShowingRef.current = false;
    }
  };

  const hideBanner = async () => {
    try {
      await adMobService.hideBanner();
      setIsBannerVisible(false);
    } catch (err) {
      console.error('Failed to hide banner:', err);
    }
  };

  const removeBanner = async () => {
    try {
      await adMobService.removeBanner();
      setIsBannerVisible(false);
    } catch (err) {
      console.error('Failed to remove banner:', err);
    }
  };

  const prepareInterstitial = async () => {
    if (!isInitialized) return;

    try {
      await adMobService.prepareInterstitial();
      setIsInterstitialReady(true);
    } catch (err) {
      console.error('Failed to prepare interstitial:', err);
      setIsInterstitialReady(false);
    }
  };

  const showInterstitial = async () => {
    if (!isInterstitialReady) return;

    try {
      await adMobService.showInterstitial();
      setIsInterstitialReady(false);
      setTimeout(() => prepareInterstitial(), 1000);
    } catch (err) {
      console.error('Failed to show interstitial:', err);
    }
  };

  const prepareReward = async () => {
    if (!isInitialized) return;

    try {
      await adMobService.prepareReward();
      setIsRewardReady(true);
    } catch (err) {
      console.error('Failed to prepare reward:', err);
      setIsRewardReady(false);
    }
  };

  const showReward = async () => {
    if (!isRewardReady) return;

    try {
      await adMobService.showReward();
      setIsRewardReady(false);
      setTimeout(() => prepareReward(), 1000);
    } catch (err) {
      console.error('Failed to show reward:', err);
    }
  };

  return {
    isInitialized,
    isBannerVisible,
    isInterstitialReady,
    isRewardReady,
    showBanner,
    hideBanner,
    removeBanner,
    showInterstitial,
    showReward,
    prepareInterstitial,
    prepareReward,
  };
};
