import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { resumeData } from '../data/resumeData';

const Experience = ({ darkMode = false }) => {
  const bgColor = darkMode ? '#111827' : '#F9FAFB';
  const cardBg = darkMode ? '#1F2937' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const detailColor = darkMode ? '#D1D5DB' : '#374151';

  return (
    <View id="experience" style={{ paddingVertical: 0, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
          Experience
        </Text>
        <View style={{ gap: 32 }}>
          {resumeData.experience.map((exp, idx) => (
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
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: textColor }}>
                {exp.role} @ {exp.company}
              </Text>
              <Text style={{ fontSize: 14, color: subTextColor, marginTop: 4, marginBottom: 16 }}>
                {exp.period}
              </Text>
              <View style={{ gap: 8 }}>
                {exp.details.map((d, i) => (
                  <View key={i} style={{ flexDirection: 'row' }}>
                    <Text style={{ color: detailColor, marginRight: 8 }}>•</Text>
                    <Text style={{ flex: 1, color: detailColor }}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Experience;
