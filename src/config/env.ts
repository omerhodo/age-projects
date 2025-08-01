/**
 * Environment Configuration
 * This file reads environment variables and provides typed configuration
 */

export interface AdMobConfig {
  appIds: {
    ios: string;
    android: string;
  };
  adIds: {
    ios: {
      banner: string;
      interstitial: string;
      reward: string;
    };
    android: {
      banner: string;
      interstitial: string;
      reward: string;
    };
  };
  testing: {
    isTestingMode: boolean;
    testingDevices: string[];
    initializeForTesting: boolean;
  };
}

export interface AppConfig {
  admob: AdMobConfig;
  environment: 'development' | 'production' | 'test';
  isProduction: boolean;
}

// Helper function to safely get environment variables
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env[key] || defaultValue;
  }
  // Server-side
  return process.env[key] || defaultValue;
};

// Helper function to parse boolean environment variables
const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse array environment variables
const getEnvArray = (key: string, defaultValue: string[] = []): string[] => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
};

// Main configuration object
export const config: AppConfig = {
  environment: getEnvVar('NEXT_PUBLIC_NODE_ENV', 'development') as
    | 'development'
    | 'production'
    | 'test',
  isProduction:
    getEnvVar('NEXT_PUBLIC_NODE_ENV', 'development') === 'production',

  admob: {
    appIds: {
      ios: getEnvVar(
        'NEXT_PUBLIC_ADMOB_IOS_APP_ID',
        'ca-app-pub-3940256099942544~1458002511'
      ),
      android: getEnvVar(
        'NEXT_PUBLIC_ADMOB_ANDROID_APP_ID',
        'ca-app-pub-3940256099942544~3347511713'
      ),
    },
    adIds: {
      ios: {
        banner: getEnvVar(
          'NEXT_PUBLIC_ADMOB_IOS_BANNER',
          'ca-app-pub-3940256099942544/2934735716'
        ),
        interstitial: getEnvVar(
          'NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL',
          'ca-app-pub-3940256099942544/4411468910'
        ),
        reward: getEnvVar(
          'NEXT_PUBLIC_ADMOB_IOS_REWARD',
          'ca-app-pub-3940256099942544/1712485313'
        ),
      },
      android: {
        banner: getEnvVar(
          'NEXT_PUBLIC_ADMOB_ANDROID_BANNER',
          'ca-app-pub-3940256099942544/6300978111'
        ),
        interstitial: getEnvVar(
          'NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL',
          'ca-app-pub-3940256099942544/1033173712'
        ),
        reward: getEnvVar(
          'NEXT_PUBLIC_ADMOB_ANDROID_REWARD',
          'ca-app-pub-3940256099942544/5224354917'
        ),
      },
    },
    testing: {
      isTestingMode: getEnvBoolean('NEXT_PUBLIC_ADMOB_TESTING_MODE', true),
      testingDevices: getEnvArray('NEXT_PUBLIC_ADMOB_TESTING_DEVICES', [
        'DEVICE_ID_HERE',
      ]),
      initializeForTesting: getEnvBoolean(
        'NEXT_PUBLIC_ADMOB_TESTING_MODE',
        true
      ),
    },
  },
};

// Export individual configs for convenience
export const admobConfig = config.admob;
export const isProduction = config.isProduction;
export const environment = config.environment;

// Development mode check
export const isDevelopment = environment === 'development';

// Debug logging in development
if (isDevelopment && typeof window !== 'undefined') {
  console.group('🔧 Environment Configuration');
  console.log('Environment:', environment);
  console.log('Is Production:', isProduction);
  console.log('AdMob Testing Mode:', admobConfig.testing.isTestingMode);
  console.log('AdMob App IDs:', admobConfig.appIds);
  console.groupEnd();
}
