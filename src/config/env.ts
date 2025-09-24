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
    disableAds: boolean;
  };
}

export interface AppConfig {
  admob: AdMobConfig;
  environment: 'development' | 'production' | 'test';
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

const isProductionBuild = (): boolean => {
  const nodeEnv = getEnvVar('NODE_ENV', 'development');
  const nextPublicEnv = getEnvVar('NEXT_PUBLIC_NODE_ENV', 'development');
  return nodeEnv === 'production' || nextPublicEnv === 'production';
};

const isProd = isProductionBuild();

const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (isProd && (!value || value.trim() === '')) {
    throw new Error(
      `FATAL: Required environment variable "${key}" is missing for production build.`
    );
  }

  const testAdIds: { [key: string]: string } = {
    NEXT_PUBLIC_ADMOB_IOS_BANNER: 'ca-app-pub-3940256099942544/2934735716',
    NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL:
      'ca-app-pub-3940256099942544/4411468910',
    NEXT_PUBLIC_ADMOB_IOS_REWARD: 'ca-app-pub-3940256099942544/1712485313',
    NEXT_PUBLIC_ADMOB_ANDROID_BANNER: 'ca-app-pub-3940256099942544/6300978111',
    NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL:
      'ca-app-pub-3940256099942544/1033173712',
    NEXT_PUBLIC_ADMOB_ANDROID_REWARD: 'ca-app-pub-3940256099942544/5224354917',
  };

  return value || testAdIds[key] || '';
};

const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value.toLowerCase() === 'true';
};

const getEnvArray = (key: string, defaultValue: string[] = []): string[] => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
};

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
        'ca-app-pub-9796784353160604~6909970738'
      ),
      android: getEnvVar(
        'NEXT_PUBLIC_ADMOB_ANDROID_APP_ID',
        'ca-app-pub-9796784353160604~3080791969'
      ),
    },
    adIds: {
      ios: {
        banner: getRequiredEnvVar('NEXT_PUBLIC_ADMOB_IOS_BANNER'),
        interstitial: getRequiredEnvVar('NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL'),
        reward: getRequiredEnvVar('NEXT_PUBLIC_ADMOB_IOS_REWARD'),
      },
      android: {
        banner: getRequiredEnvVar('NEXT_PUBLIC_ADMOB_ANDROID_BANNER'),
        interstitial: getRequiredEnvVar(
          'NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL'
        ),
        reward: getRequiredEnvVar('NEXT_PUBLIC_ADMOB_ANDROID_REWARD'),
      },
    },
    testing: {
      isTestingMode: getEnvBoolean('NEXT_PUBLIC_ADMOB_TESTING_MODE', !isProd),
      testingDevices: getEnvArray('NEXT_PUBLIC_ADMOB_TESTING_DEVICES', [
        'DEVICE_ID_HERE',
      ]),
      initializeForTesting: getEnvBoolean(
        'NEXT_PUBLIC_ADMOB_TESTING_MODE',
        !isProd
      ),
      disableAds: getEnvBoolean('NEXT_PUBLIC_DISABLE_ADS', false),
    },
  },
};

export const admobConfig = config.admob;
export const isProduction = config.isProduction;
export const environment = config.environment;
export const isDevelopment = environment === 'development';

if (isDevelopment && typeof window !== 'undefined') {
  console.group('🔧 Environment Configuration');
  console.log('Environment:', environment);
  console.log('Is Production:', isProduction);
  console.log('Is Production Build:', isProductionBuild());
  console.log('AdMob Testing Mode:', admobConfig.testing.isTestingMode);
  console.log('AdMob Disable Ads:', admobConfig.testing.disableAds);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_NODE_ENV:', process.env.NEXT_PUBLIC_NODE_ENV);
  console.log(
    'NEXT_PUBLIC_ADMOB_TESTING_MODE:',
    process.env.NEXT_PUBLIC_ADMOB_TESTING_MODE
  );
  console.log('AdMob App IDs:', admobConfig.appIds);
  console.log('AdMob Ad IDs (iOS):', admobConfig.adIds.ios);
  console.groupEnd();
}
