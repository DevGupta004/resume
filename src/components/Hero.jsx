import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { resumeData } from '../data/resumeData';
import { downloadPDF } from '../utils/linking';
import { isWeb } from '../utils/platform';

const Hero = ({ scrollToSection }) => {
  const insets = useSafeAreaInsets();
  const fadeAnimUp = useRef(new Animated.Value(0)).current;
  const fadeAnimDown = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in up animation
    Animated.timing(fadeAnimUp, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Fade in down animation with delay
    Animated.timing(fadeAnimDown, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDownload = () => {
    if (isWeb) {
      downloadPDF('/Dev_Gupta_Updated_CV.pdf');
    } else {
      // For mobile, implement PDF download using react-native-share
      downloadPDF('/Dev_Gupta_Updated_CV.pdf');
    }
  };

  const handleScrollDown = () => {
    if (scrollToSection) {
      scrollToSection('about');
    } else if (isWeb && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <View 
      id="home"
      style={{ 
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        minHeight: Platform.OS === 'web' ? 'calc(100vh - 4rem)' : undefined,
        paddingBottom: insets.bottom + 16,
        position: 'relative',
      }}
    >
      <Animated.View 
        style={{
          opacity: fadeAnimUp,
          transform: [{ translateY: fadeAnimUp.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0]
          })}]
        }}
      >
        <Text style={{ fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#111827' }}>
          {resumeData.name}
        </Text>
      </Animated.View>
      
      <Animated.View 
        style={{
          opacity: fadeAnimDown,
          transform: [{ translateY: fadeAnimDown.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }}
      >
        <Text style={{ marginTop: 16, fontSize: 20, color: '#1E88E5', textAlign: 'center' }}>
          Full-Stack Developer
        </Text>
      </Animated.View>

      <Pressable
        onPress={handleDownload}
        style={{ 
          marginTop: 32, 
          backgroundColor: '#1E88E5', 
          paddingHorizontal: 24, 
          paddingVertical: 12, 
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Download Resume</Text>
      </Pressable>

      <Pressable onPress={handleScrollDown}>
        <View style={{ 
          position: 'absolute',
          bottom: insets.bottom + 16,
          left: '50%',
          alignItems: 'center',
          transform: [{ translateX: -12 }],
        }}>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>Scroll</Text>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 9l6 6 6-6"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>
    </View>
  );
};

export default Hero;
