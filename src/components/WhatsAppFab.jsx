import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openWhatsApp } from '../utils/linking';
import { resumeData } from '../data/resumeData';

const WhatsAppFab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => openWhatsApp(resumeData.waNumber || resumeData.phone)}
      style={({ pressed }) => ({
        position: Platform.OS === 'web' ? 'fixed' : 'absolute',
        bottom: Platform.OS === 'web' ? insets.bottom + 24 : insets.bottom + 70, // Adjusted for compact bottom tabs
        right: 24,
        backgroundColor: '#25D366',
        padding: 16,
        borderRadius: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 50,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <Icon name="whatsapp" size={24} color="#FFFFFF" />
    </Pressable>
  );
};

export default WhatsAppFab;
