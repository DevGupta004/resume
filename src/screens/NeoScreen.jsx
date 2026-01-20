import React from 'react';
import { isWeb } from '../utils/platform';
import NeoScreenWeb from './NeoScreenWeb';
import NeoScreenMobile from './NeoScreenMobile';

const NeoScreen = ({ darkMode = false }) => {
  // Use separate components for web and mobile
  if (isWeb) {
    return <NeoScreenWeb darkMode={darkMode} />;
  }
  return <NeoScreenMobile darkMode={darkMode} />;
};

export default NeoScreen;
