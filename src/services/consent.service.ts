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
  // track UMP script load promise to avoid duplicate inserts
  private umpLoadPromise: Promise<void> | null = null;
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
    // Return the existing promise if load already in progress/finished
    if (this.umpLoadPromise) return this.umpLoadPromise;

    this.umpLoadPromise = new Promise((resolve, reject) => {
      try {
        if (
          document.querySelector(
            'script[src*="fundingchoicesmessages.google.com"]'
          )
        ) {
          console.log('UMP script already present');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src =
          'https://fundingchoicesmessages.google.com/i/pub-' +
          this.getPublisherId() +
          '?ers=1';
        script.async = true;

        const cleanup = () => {
          script.onload = null;
          script.onerror = null;
        };

        script.onload = () => {
          cleanup();
          console.log('UMP script loaded');
          resolve();
        };

        script.onerror = (ev) => {
          cleanup();
          console.error('UMP script failed to load', ev);
          reject(new Error('Failed to load UMP script'));
        };

        // Safety timeout: reject if script doesn't load in 5 seconds
        const to = setTimeout(() => {
          console.warn('UMP script load timed out');
          cleanup();
          reject(new Error('UMP script load timeout'));
        }, 5000);

        // Wrap resolve/reject to clear timeout
        const wrapResolve = () => {
          clearTimeout(to);
          resolve();
        };
        const wrapReject = (err: Error) => {
          clearTimeout(to);
          reject(err);
        };

        // set handlers to wrapped versions
        script.onload = () => {
          cleanup();
          console.log('UMP script loaded');
          wrapResolve();
        };
        script.onerror = (ev) => {
          cleanup();
          console.error('UMP script failed to load', ev);
          wrapReject(new Error('Failed to load UMP script'));
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('Unexpected error while inserting UMP script', err);
        reject(err as Error);
      }
    });

    return this.umpLoadPromise;
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
    try {
      const event = new CustomEvent('consent:changed', { detail: { granted } });
      window.dispatchEvent(event);
    } catch {
      // ignore
    }
  }

  setNonPersonalizedConsent(): void {
    const consentValue = 'granted';

    localStorage.setItem('gdpr_consent', consentValue);
    localStorage.setItem('gdpr_consent_time', Date.now().toString());
    localStorage.setItem('gdpr_personalization', 'non_personalized');

    this.consentInfo = {
      consentStatus: 'OBTAINED',
      formStatus: 'UNAVAILABLE',
      canRequestAds: true,
      isPrivacyOptionsRequired: false,
    };

    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: consentValue,
        analytics_storage: consentValue,
        personalization_storage: 'denied',
        ad_user_data: consentValue,
        ad_personalization: 'denied',
      });
    }

    if (window.googletag && window.googletag.pubads) {
      window.googletag.pubads().setPrivacySettings({ limitedAds: true });
    }

    console.log('🔒 Non-personalized consent set (general ads allowed)');
    try {
      const event = new CustomEvent('consent:changed', {
        detail: { granted: true, nonPersonalized: true },
      });
      window.dispatchEvent(event);
    } catch {
      // ignore
    }
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
    try {
      const event = new CustomEvent('consent:changed', {
        detail: {
          granted: false,
        },
      });
      window.dispatchEvent(event);
    } catch {
      // ignore
    }
  }
}

export const consentService = ConsentService.getInstance();
