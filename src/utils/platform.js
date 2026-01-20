import { Platform } from 'react-native';
import { useState, useEffect } from 'react';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Hook to detect mobile viewport on web
export const useIsMobileWeb = () => {
  const [isMobileWeb, setIsMobileWeb] = useState(false);

  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') {
      setIsMobileWeb(false);
      return;
    }

    const checkMobile = () => {
      // Check if viewport width is mobile-sized (typically < 768px)
      const isMobileWidth = window.innerWidth < 768;
      // Check user agent for mobile devices
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobileWeb(isMobileWidth || isMobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobileWeb;
};

// Direct function to check if mobile web (for non-hook usage)
export const isMobileWebViewport = () => {
  if (!isWeb || typeof window === 'undefined') {
    return false;
  }
  const isMobileWidth = window.innerWidth < 768;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isMobileWidth || isMobileUA;
};

// Helper to determine if bottom tabs should be shown
export const shouldShowBottomTabs = (isMobileWeb) => {
  return !isWeb || isMobileWeb;
};
