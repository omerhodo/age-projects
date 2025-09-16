import { appTrackingService } from './app-tracking.service';

export interface ConsentInfo {
  consentStatus: 'UNKNOWN' | 'NOT_REQUIRED' | 'REQUIRED' | 'OBTAINED';
  formStatus: 'UNKNOWN' | 'AVAILABLE' | 'UNAVAILABLE';
  canRequestAds: boolean;
  isPrivacyOptionsRequired: boolean;
}

export interface ConsentSettings {
  publisherId: string;
  debugGeography?:
    | 'DEBUG_GEOGRAPHY_DISABLED'
    | 'DEBUG_GEOGRAPHY_EEA'
    | 'DEBUG_GEOGRAPHY_NOT_EEA';
  testDeviceIdentifiers?: string[];
  tagForUnderAgeOfConsent?: boolean;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    googletag: {
      cmd: (() => void)[];
      pubads: () => {
        setPrivacySettings: (settings: { limitedAds: boolean }) => void;
      };
    };
  }
}

export class ConsentService {
  private static instance: ConsentService;
  private isInitialized = false;
  private consentInfo: ConsentInfo = {
    consentStatus: 'UNKNOWN',
    formStatus: 'UNKNOWN',
    canRequestAds: false,
    isPrivacyOptionsRequired: false,
  };

  public static getInstance(): ConsentService {
    if (!ConsentService.instance) {
      ConsentService.instance = new ConsentService();
    }
    return ConsentService.instance;
  }

  private constructor() {}

  async initialize(settings: ConsentSettings): Promise<void> {
    if (this.isInitialized) {
      console.log('🔧 Consent Service already initialized');
      return;
    }

    try {
      await appTrackingService.initialize();

      await this.loadUMPScript();
      await this.requestConsentInfoUpdate(settings);

      const needsATT = await appTrackingService.needsTrackingPrompt();
      if (needsATT) {
        console.log('🍎 Requesting App Tracking Transparency permission...');
        await appTrackingService.requestTrackingPermission();
      }

      this.isInitialized = true;
      console.log(
        '✅ Consent Service initialized successfully',
        this.consentInfo
      );
    } catch (error) {
      console.error('❌ Error initializing Consent Service:', error);
      throw error;
    }
  }

  private loadUMPScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="stub.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://fundingchoicesmessages.google.com/i/pub-' +
        this.getPublisherId() +
        '?ers=1';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load UMP script'));
      document.head.appendChild(script);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private requestConsentInfoUpdate(_settings: ConsentSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.googletag) {
        window.googletag = {
          cmd: [],
          pubads: () => ({ setPrivacySettings: () => {} }),
        };
      }

      window.googletag.cmd.push(() => {
        try {
          this.checkConsentStatus();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private checkConsentStatus(): void {
    const storedConsent = localStorage.getItem('gdpr_consent');
    const consentTime = localStorage.getItem('gdpr_consent_time');

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (
      storedConsent &&
      consentTime &&
      now - parseInt(consentTime) < thirtyDays
    ) {
      this.consentInfo = {
        consentStatus: 'OBTAINED',
        formStatus: 'UNAVAILABLE',
        canRequestAds: storedConsent === 'granted',
        isPrivacyOptionsRequired: false,
      };
    } else {
      this.consentInfo = {
        consentStatus: 'REQUIRED',
        formStatus: 'AVAILABLE',
        canRequestAds: false,
        isPrivacyOptionsRequired: true,
      };
    }
  }

  private async loadAndShowConsentFormIfRequired(): Promise<void> {
    if (this.consentInfo.consentStatus === 'REQUIRED') {
      return this.showConsentForm();
    }
  }

  showConsentForm(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const event = new CustomEvent('consent:show-form', { detail: {} });
        window.dispatchEvent(event);
        resolve();
      } catch {
        resolve();
      }
    });
  }

  setConsent(granted: boolean): void {
    const consentValue = granted ? 'granted' : 'denied';

    localStorage.setItem('gdpr_consent', consentValue);
    localStorage.setItem('gdpr_consent_time', Date.now().toString());

    this.consentInfo = {
      consentStatus: 'OBTAINED',
      formStatus: 'UNAVAILABLE',
      canRequestAds: granted,
      isPrivacyOptionsRequired: false,
    };

    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: consentValue,
        analytics_storage: consentValue,
        personalization_storage: consentValue,
        ad_user_data: consentValue,
        ad_personalization: consentValue,
      });
    }

    if (window.googletag && window.googletag.pubads) {
      window.googletag.pubads().setPrivacySettings({
        limitedAds: !granted,
      });
    }

    console.log('🔒 Consent set:', consentValue);
  }

  getConsentInfo(): ConsentInfo {
    return { ...this.consentInfo };
  }

  async canShowAds(): Promise<boolean> {
    if (!this.consentInfo.canRequestAds) {
      return false;
    }

    const canShowPersonalizedAds = await appTrackingService.canShowAds();
    return canShowPersonalizedAds;
  }

  canShowAdsSync(): boolean {
    return this.consentInfo.canRequestAds;
  }

  showPrivacyOptionsForm(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const event = new CustomEvent('consent:show-privacy-options', {
          detail: {},
        });
        window.dispatchEvent(event);
        resolve();
      } catch {
        this.showConsentForm()
          .then(resolve)
          .catch(() => resolve());
      }
    });
  }

  private getPublisherId(): string {
    return process.env.NEXT_PUBLIC_ADMOB_PUBLISHER_ID || 'test-publisher-id';
  }

  resetConsent(): void {
    localStorage.removeItem('gdpr_consent');
    localStorage.removeItem('gdpr_consent_time');
    this.consentInfo = {
      consentStatus: 'UNKNOWN',
      formStatus: 'UNKNOWN',
      canRequestAds: false,
      isPrivacyOptionsRequired: false,
    };
    console.log('🔄 Consent reset');
  }
}

export const consentService = ConsentService.getInstance();
