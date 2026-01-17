import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '../utils/platform';

const tabs = [
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'neo', label: 'Ask Dev', icon: 'message-circle' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
];

const BottomTabs = ({ activeTab, onTabPress, darkMode }) => {
  const insets = useSafeAreaInsets();
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const activeColor = '#1E88E5';
  const inactiveColor = darkMode ? '#6B7280' : '#9CA3AF';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';

  // Modern compact tab bar dimensions
  const TAB_BAR_HEIGHT = 56; // Reduced from 72px
  const ICON_SIZE = 20; // Reduced from 22px
  const LABEL_FONT_SIZE = 10; // Reduced from 11px
  const ICON_CONTAINER_SIZE = 32; // Reduced from 40px
  const VERTICAL_PADDING = 6; // Reduced padding
  const HORIZONTAL_PADDING = 12;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: bgColor,
        borderTopWidth: 1,
        borderTopColor: borderColor,
        paddingBottom: insets.bottom,
        paddingTop: VERTICAL_PADDING,
        height: TAB_BAR_HEIGHT + insets.bottom + VERTICAL_PADDING,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: darkMode ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 50,
      }}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: HORIZONTAL_PADDING,
        height: TAB_BAR_HEIGHT,
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
                minHeight: 44, // Minimum touch target
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: ICON_CONTAINER_SIZE,
                height: ICON_CONTAINER_SIZE,
                borderRadius: 8,
                backgroundColor: isActive 
                  ? (darkMode ? 'rgba(30, 136, 229, 0.15)' : 'rgba(30, 136, 229, 0.08)')
                  : 'transparent',
                marginBottom: 2, // Small gap between icon and label
              }}>
                <Icon
                  name={tab.icon}
                  size={ICON_SIZE}
                  color={isActive ? activeColor : inactiveColor}
                />
              </View>
              <Text style={{
                fontSize: LABEL_FONT_SIZE,
                fontWeight: isActive ? '600' : '500',
                color: isActive ? activeColor : inactiveColor,
                marginTop: 2,
                letterSpacing: 0.2,
              }}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={{
                  position: 'absolute',
                  top: -VERTICAL_PADDING,
                  width: 28,
                  height: 2.5,
                  backgroundColor: activeColor,
                  borderRadius: 1.5,
                }} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default BottomTabs;
