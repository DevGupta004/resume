import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { resumeData } from '../data/resumeData';

const getSkillIcon = (skill) => {
  const skillLower = skill.toLowerCase();
  if (skillLower.includes('react')) return 'react';
  if (skillLower.includes('node')) return 'nodejs';
  if (skillLower.includes('javascript')) return 'language-javascript';
  if (skillLower.includes('mongodb')) return 'database';
  if (skillLower.includes('mysql')) return 'database';
  if (skillLower.includes('firebase')) return 'firebase';
  if (skillLower.includes('express')) return 'server';
  if (skillLower.includes('redux')) return 'code-tags'; // 'redux' icon doesn't exist, using fallback
  if (skillLower.includes('git')) return 'git';
  return 'code-tags';
};

const Skills = ({ darkMode = false }) => {
  const bgColor = darkMode ? '#111827' : '#F9FAFB';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const skillTextColor = darkMode ? '#D1D5DB' : '#374151';
  const iconColor = darkMode ? '#60A5FA' : '#1E88E5';

  return (
    <View id="skills" style={{ paddingVertical: 80, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor, textAlign: 'center' }}>
          Skills
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {resumeData.skills.map((skill, idx) => (
            <View key={idx} style={{ flexDirection: 'column', alignItems: 'center', width: 80 }}>
              <Icon 
                name={getSkillIcon(skill)} 
                size={40} 
                color={iconColor} 
              />
              <Text style={{ marginTop: 8, textAlign: 'center', fontSize: 14, color: skillTextColor }}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Skills;
