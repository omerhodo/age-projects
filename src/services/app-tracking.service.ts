import { Capacitor } from '@capacitor/core';
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency';

export enum TrackingAuthorizationStatus {
  notDetermined = 'notDetermined',
  restricted = 'restricted',
  denied = 'denied',
  authorized = 'authorized',
}

export interface TrackingService {
  requestTrackingPermission(): Promise<TrackingAuthorizationStatus>;
  getTrackingStatus(): Promise<TrackingAuthorizationStatus>;
  canShowAds(): Promise<boolean>;
}

class AppTrackingService implements TrackingService {
  private isInitialized = false;

  /**
   * Request tracking permission from user using iOS ATT framework
   * This must be called before any tracking/advertising
   */
  async requestTrackingPermission(): Promise<TrackingAuthorizationStatus> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      // On web or Android, we consider tracking authorized by default
      return TrackingAuthorizationStatus.authorized;
    }

    try {
      const result = await AppTrackingTransparency.requestPermission();
      const status = result.status as TrackingAuthorizationStatus;

      console.log('ATT Status:', status);

      // Store the decision in localStorage for consistency with consent service
      localStorage.setItem('att-status', status.toString());

      return status;
    } catch (error) {
      console.error('Failed to request tracking permission:', error);
      // If there's an error, assume denied for safety
      return TrackingAuthorizationStatus.denied;
    }
  }

  /**
   * Get current tracking authorization status
   */
  async getTrackingStatus(): Promise<TrackingAuthorizationStatus> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      return TrackingAuthorizationStatus.authorized;
    }

    try {
      const result = await AppTrackingTransparency.getStatus();
      return result.status as TrackingAuthorizationStatus;
    } catch (error) {
      console.error('Failed to get tracking status:', error);
      // Check localStorage fallback
      const stored = localStorage.getItem('att-status');
      return stored
        ? (stored as TrackingAuthorizationStatus)
        : TrackingAuthorizationStatus.notDetermined;
    }
  }

  /**
   * Check if we can show personalized ads
   * Returns true only if user has explicitly authorized tracking
   */
  async canShowAds(): Promise<boolean> {
    const status = await this.getTrackingStatus();
    return status === TrackingAuthorizationStatus.authorized;
  }

  /**
   * Check if we need to show ATT prompt
   */
  async needsTrackingPrompt(): Promise<boolean> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      return false;
    }

    const status = await this.getTrackingStatus();
    return status === TrackingAuthorizationStatus.notDetermined;
  }

  /**
   * Initialize the tracking service
   * Should be called early in app lifecycle
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Just get the status to initialize
      await this.getTrackingStatus();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize tracking service:', error);
    }
  }
}

export const appTrackingService = new AppTrackingService();
