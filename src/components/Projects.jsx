import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { openURL } from '../utils/linking';

import { resumeData } from '../data/resumeData';

const Projects = ({ darkMode = false }) => {
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const cardBg = darkMode ? '#1F2937' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const linkColor = darkMode ? '#60A5FA' : '#1E88E5';

  const getProjectWidth = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? '48%' : '100%';
    }
    return '100%';
  };

  return (
    <View id="projects" style={{ paddingVertical: 48, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
          Projects
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          marginHorizontal: -12,
          gap: 24,
        }}>
          {resumeData.projects.map((proj, idx) => (
            <View 
              key={idx} 
              style={{ 
                width: getProjectWidth(),
                paddingHorizontal: 12,
                marginBottom: 24,
              }}
            >
              <View style={{
                borderWidth: 1,
                borderColor: borderColor,
                borderRadius: 8,
                padding: 24,
                backgroundColor: cardBg,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: darkMode ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: textColor }}>
                  {proj.title}
                </Text>
                <Text style={{ marginBottom: 16, fontSize: 14, color: subTextColor }}>
                  {proj.tech.join(' · ')}
                </Text>
                <Text style={{ marginBottom: 16, color: textColor }}>
                  {proj.description}
                </Text>
                {Array.isArray(proj.links) && proj.links.length > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                    {proj.links.map((l, i) => {
                      const isGithub = l.url?.includes('github.com') || /github/i.test(l.label || '');
                      const iconName = isGithub ? 'github' : 'external-link';
                      const label = l.label || (isGithub ? 'GitHub' : 'Open Link');
                      return (
                        <Pressable
                          key={i}
                          onPress={() => openURL(l.url)}
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Icon name={iconName} size={16} color={linkColor} />
                          <Text style={{ marginLeft: 4, color: linkColor }}>{label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (() => {
                  const url = proj.github || proj.link;
                  if (!url) return null;
                  const isGithub = url.includes('github.com');
                  const iconName = isGithub ? 'github' : 'external-link';
                  const label = isGithub ? 'View on GitHub' : 'Open Link';
                  return (
                    <Pressable
                      onPress={() => openURL(url)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Icon name={iconName} size={16} color={linkColor} />
                      <Text style={{ marginLeft: 4, color: linkColor }}>{label}</Text>
                    </Pressable>
                  );
                })()}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Projects;
