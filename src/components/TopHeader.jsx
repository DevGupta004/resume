import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';
import { isWeb } from '../utils/platform';
import { resumeData } from '../data/resumeData';
import { getProfileImage } from '../utils/imagePicker';

const tabs = [
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'neo', label: 'Ask Dev', icon: 'message-circle' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
];

const TopHeader = ({ darkMode, onDarkModeToggle, onProfilePress, activeTab, onTabPress, showTabs = true }) => {
  const insets = useSafeAreaInsets();
  const [profileImageUri, setProfileImageUri] = useState(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    const uri = await getProfileImage();
    if (uri) {
      setProfileImageUri(uri);
    }
  };


  const toggleDark = async () => {
    const newDarkMode = !darkMode;
    onDarkModeToggle(newDarkMode);
    await storage.setItem('theme', newDarkMode ? 'dark' : 'light');

    if (isWeb && typeof document !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const activeColor = '#1E88E5';
  const inactiveColor = darkMode ? '#6B7280' : '#9CA3AF';

  return (
    <View
      style={{
        position: Platform.OS === 'web' ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: bgColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        zIndex: 50,
        paddingTop: insets.top,
        height: isWeb ? 64 + insets.top : 56 + insets.top,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: darkMode ? 0.2 : 0.05,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      {/* Main Header Row */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={onProfilePress}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            ) : (
              <Icon
                name="user"
                size={20}
                color={darkMode ? '#E5E7EB' : '#374151'}
              />
            )}
          </Pressable>
          <Pressable onPress={onProfilePress}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '700', 
              color: textColor,
            }}>
              {resumeData.name.split(' ')[0]}
            </Text>
          </Pressable>
        </View>

        {/* Tabs for Web - Center (hidden on mobile web) */}
        {isWeb && showTabs && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: 24,
          }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => onTabPress(tab.id)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isActive 
                      ? (darkMode ? 'rgba(30, 136, 229, 0.2)' : 'rgba(30, 136, 229, 0.1)')
                      : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <Icon
                    name={tab.icon}
                    size={18}
                    color={isActive ? activeColor : inactiveColor}
                  />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? activeColor : inactiveColor,
                  }}>
                    {tab.label}
                  </Text>
                  {isActive && (
                    <View style={{
                      position: 'absolute',
                      bottom: -11,
                      left: '50%',
                      marginLeft: -16,
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
        )}

        <Pressable
          onPress={toggleDark}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
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
};

export default TopHeader;
