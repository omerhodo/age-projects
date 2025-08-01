// Environment Variables Type Definitions

declare namespace NodeJS {
    interface ProcessEnv {
        // AdMob Configuration
        NEXT_PUBLIC_ADMOB_IOS_APP_ID: string;
        NEXT_PUBLIC_ADMOB_ANDROID_APP_ID: string;

        // AdMob Ad Unit IDs - iOS
        NEXT_PUBLIC_ADMOB_IOS_BANNER: string;
        NEXT_PUBLIC_ADMOB_IOS_INTERSTITIAL: string;
        NEXT_PUBLIC_ADMOB_IOS_REWARD: string;

        // AdMob Ad Unit IDs - Android
        NEXT_PUBLIC_ADMOB_ANDROID_BANNER: string;
        NEXT_PUBLIC_ADMOB_ANDROID_INTERSTITIAL: string;
        NEXT_PUBLIC_ADMOB_ANDROID_REWARD: string;

        // AdMob Testing Configuration
        NEXT_PUBLIC_ADMOB_TESTING_MODE: string;
        NEXT_PUBLIC_ADMOB_TESTING_DEVICES: string;

        // App Environment
        NEXT_PUBLIC_NODE_ENV: 'development' | 'production' | 'test';

        // Node.js built-in
        NODE_ENV: 'development' | 'production' | 'test';
    }
}
