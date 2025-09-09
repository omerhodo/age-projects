import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.omerhodo.agecalculator',
  appName: 'Age Calculator',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#667eea',
      overlaysWebView: true,
    },
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: '#667eea',
      statusBarStyle: 'dark',
      navigationBarColor: '#764ba2',
      navigationBarStyle: 'dark',
    },
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
  },
};

export default config;
