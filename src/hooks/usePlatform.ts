import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

export interface PlatformInfo {
  isMobile: boolean;
  isNative: boolean;
  isWeb: boolean;
  platform: 'ios' | 'android' | 'web';
  isIOS: boolean;
  isAndroid: boolean;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isMobile: false,
    isNative: false,
    isWeb: true,
    platform: 'web',
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    const isMobile =
      isNative || (typeof window !== 'undefined' && window.innerWidth <= 768);

    setPlatformInfo({
      isMobile,
      isNative,
      isWeb: !isNative,
      platform: platform as 'ios' | 'android' | 'web',
      isIOS: platform === 'ios',
      isAndroid: platform === 'android',
    });
  }, []);

  return platformInfo;
};

export default usePlatform;
