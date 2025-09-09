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
      await this.loadUMPScript();
      await this.requestConsentInfoUpdate(settings);

      // Gerekirse rıza formunu göster
      if (this.consentInfo.formStatus === 'AVAILABLE') {
        await this.loadAndShowConsentFormIfRequired();
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

  /**
   * Google UMP SDK script'ini yükler
   */
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

  /**
   * Rıza bilgilerini günceller
   */
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

  /**
   * Rıza durumunu kontrol eder
   */
  private checkConsentStatus(): void {
    // localStorage'dan önceki rıza durumunu kontrol et
    const storedConsent = localStorage.getItem('gdpr_consent');
    const consentTime = localStorage.getItem('gdpr_consent_time');

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 gün milisaniye cinsinden

    // Eğer rıza varsa ve 30 günden eski değilse
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
      // Yeni rıza gerekli
      this.consentInfo = {
        consentStatus: 'REQUIRED',
        formStatus: 'AVAILABLE',
        canRequestAds: false,
        isPrivacyOptionsRequired: true,
      };
    }
  }

  /**
   * Gerekirse rıza formunu yükler ve gösterir
   */
  private async loadAndShowConsentFormIfRequired(): Promise<void> {
    if (this.consentInfo.consentStatus === 'REQUIRED') {
      return this.showConsentForm();
    }
  }

  /**
   * Rıza formunu gösterir
   */
  showConsentForm(): Promise<void> {
    return new Promise((resolve) => {
      // Basit bir rıza formu göster
      this.createConsentModal(resolve);
    });
  }

  /**
   * Basit rıza modalı oluşturur
   */
  private createConsentModal(callback: () => void): void {
    // Modal container
    const modal = document.createElement('div');
    modal.id = 'gdpr-consent-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Modal content
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      margin: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    `;

    const title = document.createElement('h2');
    title.textContent = 'Gizlilik ve Çerezler';
    title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-size: 24px;';

    const text = document.createElement('p');
    text.innerHTML = `
      Bu uygulama deneyiminizi iyileştirmek için çerezleri ve kişiselleştirilmiş reklamları kullanır.
      Devam ederek <a href="/privacy-policy" target="_blank" style="color: #1976d2;">Gizlilik Politikamızı</a>
      kabul etmiş olursunuz.
    `;
    text.style.cssText = 'color: #666; line-height: 1.5; margin: 0 0 25px 0;';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText =
      'display: flex; gap: 10px; justify-content: flex-end;';

    const rejectButton = document.createElement('button');
    rejectButton.textContent = 'Reddet';
    rejectButton.style.cssText = `
      padding: 12px 24px;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Kabul Et';
    acceptButton.style.cssText = `
      padding: 12px 24px;
      border: none;
      background: #1976d2;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;

    // Event listeners
    acceptButton.onclick = () => {
      this.setConsent(true);
      document.body.removeChild(modal);
      callback();
    };

    rejectButton.onclick = () => {
      this.setConsent(false);
      document.body.removeChild(modal);
      callback();
    };

    // Assemble modal
    buttonContainer.appendChild(rejectButton);
    buttonContainer.appendChild(acceptButton);
    content.appendChild(title);
    content.appendChild(text);
    content.appendChild(buttonContainer);
    modal.appendChild(content);

    document.body.appendChild(modal);
  }

  /**
   * Kullanıcı rızasını ayarlar
   */
  private setConsent(granted: boolean): void {
    const consentValue = granted ? 'granted' : 'denied';

    // localStorage'a kaydet
    localStorage.setItem('gdpr_consent', consentValue);
    localStorage.setItem('gdpr_consent_time', Date.now().toString());

    // Consent bilgilerini güncelle
    this.consentInfo = {
      consentStatus: 'OBTAINED',
      formStatus: 'UNAVAILABLE',
      canRequestAds: granted,
      isPrivacyOptionsRequired: false,
    };

    // Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: consentValue,
        analytics_storage: consentValue,
        personalization_storage: consentValue,
        ad_user_data: consentValue,
        ad_personalization: consentValue,
      });
    }

    // AdMob consent
    if (window.googletag && window.googletag.pubads) {
      window.googletag.pubads().setPrivacySettings({
        limitedAds: !granted,
      });
    }

    console.log('🔒 Consent set:', consentValue);
  }

  /**
   * Mevcut rıza bilgilerini döndürür
   */
  getConsentInfo(): ConsentInfo {
    return { ...this.consentInfo };
  }

  /**
   * Reklamların gösterilip gösterilemeyeceğini kontrol eder
   */
  canShowAds(): boolean {
    return this.consentInfo.canRequestAds;
  }

  /**
   * Gizlilik seçenekleri menüsünü gösterir
   */
  showPrivacyOptionsForm(): Promise<void> {
    return this.showConsentForm();
  }

  /**
   * Publisher ID'yi döndürür (ortam değişkeninden)
   */
  private getPublisherId(): string {
    return process.env.NEXT_PUBLIC_ADMOB_PUBLISHER_ID || 'test-publisher-id';
  }

  /**
   * Rızayı sıfırlar (test amaçlı)
   */
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
