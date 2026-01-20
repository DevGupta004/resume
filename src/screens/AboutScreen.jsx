import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resumeData } from '../data/resumeData';
import { isWeb, useIsMobileWeb } from '../utils/platform';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Awards from '../components/Awards';
import Education from '../components/Education';
import Contact from '../components/Contact';

const AboutScreen = ({ darkMode }) => {
  const insets = useSafeAreaInsets();
  const isMobileWeb = useIsMobileWeb();
  // Bottom tab bar height: show on mobile or mobile web (compact: 56px + padding + safe area)
  const bottomPadding = (isWeb && !isMobileWeb) ? 32 : insets.bottom + 70;
  // Top header height: 64px (desktop web) or 56px (mobile/mobile web) + safe area + compact spacing
  const topPadding = (isWeb && !isMobileWeb) ? insets.top + 64 + 8 : insets.top + 56 + 8;
  const bgColor = darkMode ? '#111827' : '#FFFFFF';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
      }}
      showsVerticalScrollIndicator={false}
    >
      <About darkMode={darkMode} />
      <Experience darkMode={darkMode} />
      <Projects darkMode={darkMode} />
      <Skills darkMode={darkMode} />
      <Awards darkMode={darkMode} />
      <Education darkMode={darkMode} />
      <Contact darkMode={darkMode} />
    </ScrollView>
  );
};

export default AboutScreen;
