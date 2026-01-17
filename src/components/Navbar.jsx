import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, Platform, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';
import { isWeb, isMobile } from '../utils/platform';
import { resumeData } from '../data/resumeData';

const links = [
  { name: 'About', id: 'about', icon: 'user' },
  { name: 'Experience', id: 'experience', icon: 'briefcase' },
  { name: 'Projects', id: 'projects', icon: 'folder' },
  { name: 'Skills', id: 'skills', icon: 'code' },
  { name: 'Contact', id: 'contact', icon: 'mail' },
];

const Navbar = ({ scrollToSection, scrollY = 0, sectionHeights = {} }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const insets = useSafeAreaInsets();
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    // Track scroll position for active section (web only)
    if (isWeb && typeof window !== 'undefined') {
      const handleScroll = () => {
        const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Update active section on mobile based on scroll position
  useEffect(() => {
    if (!isWeb && Object.keys(sectionHeights).length > 0) {
      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      let cumulativeHeight = 0;
      const headerHeight = 56;
      const scrollPosition = scrollY + headerHeight + 50; // Add offset
      
      for (let i = 0; i < sections.length; i++) {
        const sectionId = sections[i];
        const sectionHeight = sectionHeights[sectionId] || 0;
        cumulativeHeight += sectionHeight;
        
        if (scrollPosition <= cumulativeHeight || i === sections.length - 1) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  }, [scrollY, sectionHeights]);

  const toggleDark = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    await storage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (isWeb && typeof document !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleLinkPress = (linkId) => {
    setActiveSection(linkId);
    if (scrollToSection) {
      scrollToSection(linkId);
    } else if (isWeb && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const element = document.getElementById(linkId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Web: Modern Tab Navigation
  if (isWeb) {
    const bgColor = darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = darkMode ? '#E5E7EB' : '#374151';
    const activeColor = '#1E88E5';
    const inactiveColor = darkMode ? '#9CA3AF' : '#6B7280';

    return (
      <View 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: bgColor,
          borderBottomWidth: 1,
          borderBottomColor: darkMode ? '#374151' : '#E5E7EB',
          zIndex: 1000,
          paddingTop: insets.top,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <View style={{
          maxWidth: 1280,
          marginHorizontal: 'auto',
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}>
          {/* Logo */}
          <Pressable 
            onPress={() => handleLinkPress('home')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: activeColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
                {resumeData.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>
              {resumeData.name.split(' ')[0]}
            </Text>
          </Pressable>
          
          {/* Tab Navigation */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 8,
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
            padding: 4,
            borderRadius: 12,
          }}>
            {links.map((link, index) => {
              const isActive = activeSection === link.id;
              return (
                <Pressable
                  key={link.id}
                  onPress={() => handleLinkPress(link.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isActive ? (darkMode ? '#1E88E5' : '#FFFFFF') : 'transparent',
                    shadowColor: isActive ? '#1E88E5' : 'transparent',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isActive ? 0.2 : 0,
                    shadowRadius: 4,
                    elevation: isActive ? 2 : 0,
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? (darkMode ? '#FFFFFF' : '#1E88E5') : inactiveColor,
                  }}>
                    {link.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Theme Toggle */}
          <Pressable 
            onPress={toggleDark}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon 
              name={darkMode ? 'sun' : 'moon'} 
              size={20} 
              color={darkMode ? '#F59E0B' : '#374151'} 
            />
          </Pressable>
        </View>
      </View>
    );
  }

  // Mobile: Bottom Tab Navigation
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const activeColor = '#1E88E5';
  const inactiveColor = darkMode ? '#6B7280' : '#9CA3AF';

  return (
    <>
      {/* Top Header (Mobile) */}
      <View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: bgColor,
          borderBottomWidth: 1,
          borderBottomColor: darkMode ? '#374151' : '#E5E7EB',
          zIndex: 50,
          paddingTop: insets.top,
          height: 56 + insets.top,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          height: 56,
        }}>
          <Pressable onPress={() => handleLinkPress('home')}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: darkMode ? '#FFFFFF' : '#111827' }}>
              {resumeData.name.split(' ')[0]}
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={toggleDark}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon 
              name={darkMode ? 'sun' : 'moon'} 
              size={20} 
              color={darkMode ? '#F59E0B' : '#374151'} 
            />
          </Pressable>
        </View>
      </View>

      {/* Bottom Tab Bar */}
      <View 
        style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: bgColor,
          borderTopWidth: 1,
          borderTopColor: darkMode ? '#374151' : '#E5E7EB',
          paddingBottom: insets.bottom,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
          zIndex: 50,
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Pressable
                key={link.id}
                onPress={() => handleLinkPress(link.id)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  borderRadius: 12,
                  minHeight: 56,
                }}
              >
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: isActive ? (darkMode ? 'rgba(30, 136, 229, 0.2)' : 'rgba(30, 136, 229, 0.1)') : 'transparent',
                }}>
                  <Icon 
                    name={link.icon} 
                    size={22} 
                    color={isActive ? activeColor : inactiveColor}
                  />
                </View>
                <Text style={{ 
                  fontSize: 11, 
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? activeColor : inactiveColor,
                  marginTop: 4,
                }}>
                  {link.name}
                </Text>
                {isActive && (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    width: 32,
                    height: 3,
                    backgroundColor: activeColor,
                    borderRadius: 2,
                  }} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default Navbar;
