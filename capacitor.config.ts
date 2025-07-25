import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.omerhodo.agecalculator',
  appName: 'Age Calculator',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
