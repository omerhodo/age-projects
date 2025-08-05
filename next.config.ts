import type { NextConfig } from 'next';

const isCapacitorBuild = process.env.BUILD_TARGET === 'capacitor';

const nextConfig: NextConfig = {
  /* config options here */
  ...(isCapacitorBuild && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  env: {
    // Explicitly declare environment variables for better IDE support
    NEXT_PUBLIC_ADMOB_IOS_APP_ID: process.env.NEXT_PUBLIC_ADMOB_IOS_APP_ID,
    NEXT_PUBLIC_ADMOB_ANDROID_APP_ID:
      process.env.NEXT_PUBLIC_ADMOB_ANDROID_APP_ID,
    NEXT_PUBLIC_ADMOB_IOS_BANNER: process.env.NEXT_PUBLIC_ADMOB_IOS_BANNER,
    NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL:
      process.env.NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL,
    NEXT_PUBLIC_ADMOB_IOS_REWARD: process.env.NEXT_PUBLIC_ADMOB_IOS_REWARD,
    NEXT_PUBLIC_ADMOB_ANDROID_BANNER:
      process.env.NEXT_PUBLIC_ADMOB_ANDROID_BANNER,
    NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL:
      process.env.NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL,
    NEXT_PUBLIC_ADMOB_ANDROID_REWARD:
      process.env.NEXT_PUBLIC_ADMOB_ANDROID_REWARD,
    NEXT_PUBLIC_ADMOB_TESTING_MODE: process.env.NEXT_PUBLIC_ADMOB_TESTING_MODE,
    NEXT_PUBLIC_ADMOB_TESTING_DEVICES:
      process.env.NEXT_PUBLIC_ADMOB_TESTING_DEVICES,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  },
};

export default nextConfig;
