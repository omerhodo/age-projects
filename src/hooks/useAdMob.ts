import { BannerAdPosition } from '@capacitor-community/admob';
import { useEffect, useState } from 'react';
import { adMobService } from '../services/admob.service';

export const useAdMob = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isBannerVisible, setIsBannerVisible] = useState(false);
    const [isInterstitialReady, setIsInterstitialReady] = useState(false);
    const [isRewardReady, setIsRewardReady] = useState(false);

    useEffect(() => {
        initializeAdMob();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initializeAdMob = async () => {
        try {
            await adMobService.initialize();
            setIsInitialized(true);

            prepareInterstitial();
            prepareReward();
        } catch (error) {
            console.error('Failed to initialize AdMob:', error);
        }
    };

    const showBanner = async (
        position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER
    ) => {
        if (!isInitialized) return;

        try {
            await adMobService.showBanner(position);
            setIsBannerVisible(true);
        } catch (error) {
            console.error('Failed to show banner:', error);
        }
    };

    const hideBanner = async () => {
        try {
            await adMobService.hideBanner();
            setIsBannerVisible(false);
        } catch (error) {
            console.error('Failed to hide banner:', error);
        }
    };

    const removeBanner = async () => {
        try {
            await adMobService.removeBanner();
            setIsBannerVisible(false);
        } catch (error) {
            console.error('Failed to remove banner:', error);
        }
    };

    const prepareInterstitial = async () => {
        if (!isInitialized) return;

        try {
            await adMobService.prepareInterstitial();
            setIsInterstitialReady(true);
        } catch (error) {
            console.error('Failed to prepare interstitial:', error);
            setIsInterstitialReady(false);
        }
    };

    const showInterstitial = async () => {
        if (!isInterstitialReady) return;

        try {
            await adMobService.showInterstitial();
            setIsInterstitialReady(false);
            setTimeout(() => prepareInterstitial(), 1000);
        } catch (error) {
            console.error('Failed to show interstitial:', error);
        }
    };

    const prepareReward = async () => {
        if (!isInitialized) return;

        try {
            await adMobService.prepareReward();
            setIsRewardReady(true);
        } catch (error) {
            console.error('Failed to prepare reward:', error);
            setIsRewardReady(false);
        }
    };

    const showReward = async () => {
        if (!isRewardReady) return;

        try {
            await adMobService.showReward();
            setIsRewardReady(false);
            setTimeout(() => prepareReward(), 1000);
        } catch (error) {
            console.error('Failed to show reward:', error);
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
