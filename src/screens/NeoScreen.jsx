import React from 'react';
import { isWeb, useIsMobileWeb } from '../utils/platform';
import NeoScreenWeb from './NeoScreenWeb';
import NeoScreenMobile from './NeoScreenMobile';

const NeoScreen = ({ darkMode = false }) => {
  const isMobileWeb = useIsMobileWeb();
  // Use mobile component for native mobile or mobile web, web component for desktop web
  if (isWeb && !isMobileWeb) {
    return <NeoScreenWeb darkMode={darkMode} />;
  }
  return <NeoScreenMobile darkMode={darkMode} />;
};

export default NeoScreen;
