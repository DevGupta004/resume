import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { resumeData } from '../data/resumeData';

const Awards = ({ darkMode = false }) => {
  const bgColor = darkMode ? '#111827' : '#F9FAFB';
  const cardBg = darkMode ? '#1F2937' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const iconColor = darkMode ? '#F59E0B' : '#F59E0B';

  return (
    <View id="awards" style={{ paddingVertical: 48, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
          Awards
        </Text>
        <View style={{ gap: 24 }}>
          {resumeData.awards?.map((award, idx) => (
            <View 
              key={idx} 
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
                borderRadius: 8,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: darkMode ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Icon name="award" size={24} color={iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: textColor }}>
                  {award.title}
                </Text>
                <Text style={{ fontSize: 14, color: subTextColor, lineHeight: 20 }}>
                  {award.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Awards;
