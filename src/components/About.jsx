import React from 'react';
import { View, Text } from 'react-native';

import { resumeData } from '../data/resumeData';

const About = ({ darkMode = false }) => {
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const subTextColor = darkMode ? '#9CA3AF' : '#374151';

  return (
    <View 
      id="about" 
      style={{ 
        paddingTop: 24,
        paddingBottom: 24,
        maxWidth: 1280, 
        marginHorizontal: 'auto', 
        paddingHorizontal: 16,
        backgroundColor: bgColor,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
        About Me
      </Text>
      <Text style={{ lineHeight: 24, color: subTextColor }}>
        {resumeData.about}
      </Text>
    </View>
  );
};

export default About;
