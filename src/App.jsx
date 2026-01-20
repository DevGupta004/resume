import React, { useState } from 'react';
import { View, Platform, Vibration } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from './utils/storage';
import { isWeb } from './utils/platform';

// Screens
import AboutScreen from './screens/AboutScreen';
import JobsScreen from './screens/JobsScreen';
import NeoScreen from './screens/NeoScreen';
import ExperienceScreen from './screens/ExperienceScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import SkillsScreen from './screens/SkillsScreen';
import ContactScreen from './screens/ContactScreen';

// Components
import BottomTabs from './components/BottomTabs';
import Drawer from './components/Drawer';
import TopHeader from './components/TopHeader';
import WhatsAppFab from './components/WhatsAppFab';

const App = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerScreen, setDrawerScreen] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const initTheme = async () => {
      const stored = await storage.getItem('theme');
      if (isWeb && typeof window !== 'undefined' && typeof document !== 'undefined') {
        const sysPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = stored === 'dark' || (!stored && sysPref);
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
          setDarkMode(true);
        }
      } else {
        setDarkMode(stored === 'dark');
      }
    };
    initTheme();

    // Clean up incomplete downloads on app start (mobile only)
    if (!isWeb) {
      const cleanupDownloads = async () => {
        try {
          const modelManager = require('./utils/modelManager');
          if (modelManager && modelManager.cleanupIncompleteDownloads) {
            await modelManager.cleanupIncompleteDownloads();
          }
        } catch (error) {
          // Silently fail - this is not critical
          console.log('Could not cleanup incomplete downloads:', error.message);
        }
      };
      cleanupDownloads();
    }
  }, []);

  const handleTabPress = (tabId) => {
    Vibration.vibrate(10);
    setActiveTab(tabId);
    setDrawerScreen(null);
  };

  const handleDrawerNavigate = (screenId) => {
    setDrawerScreen(screenId);
    setDrawerVisible(false);
  };

  const renderScreen = () => {
    if (drawerScreen) {
      switch (drawerScreen) {
        case 'experience':
          return <ExperienceScreen darkMode={darkMode} />;
        case 'projects':
          return <ProjectsScreen darkMode={darkMode} />;
        case 'skills':
          return <SkillsScreen darkMode={darkMode} />;
        case 'contact':
          return <ContactScreen darkMode={darkMode} />;
        default:
          return <AboutScreen darkMode={darkMode} />;
      }
    }

    switch (activeTab) {
      case 'about':
        return <AboutScreen darkMode={darkMode} />;
      case 'jobs':
        return <JobsScreen darkMode={darkMode} />;
      case 'neo':
        return <NeoScreen darkMode={darkMode} />;
      default:
        return <AboutScreen darkMode={darkMode} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: darkMode ? '#111827' : '#FFFFFF',
          width: '100%',
          minHeight: typeof window !== 'undefined' ? '100vh' : '100%',
        }}
      >
        <TopHeader
          darkMode={darkMode}
          onDarkModeToggle={setDarkMode}
          onProfilePress={() => setDrawerVisible(true)}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
        {React.cloneElement(renderScreen(), { darkMode })}
        {!isWeb && (
          <BottomTabs
            activeTab={activeTab}
            onTabPress={handleTabPress}
            darkMode={darkMode}
          />
        )}
        <Drawer
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          onNavigate={handleDrawerNavigate}
          darkMode={darkMode}
        />
        {/* <WhatsAppFab /> */}
      </View>
    </SafeAreaProvider>
  );
};

export default App;
