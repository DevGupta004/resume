import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Animated, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '../utils/platform';

// Conditional WebView import
let WebView;
if (!isWeb) {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview not available');
  }
}

const BottomSheet = ({ visible, url, onClose, darkMode }) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';

  // For web, use iframe
  if (isWeb && url) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={() => {}} // Prevent Android back button from closing
      >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
          <View
            style={{
              backgroundColor: bgColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: '90%',
            }}
          >
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}>
              <Text style={{
                flex: 1,
                fontSize: 16,
                fontWeight: '600',
                color: textColor,
                marginRight: 8,
              }} numberOfLines={1}>
                {url}
              </Text>
              <Pressable
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="x" size={20} color={textColor} />
              </Pressable>
            </View>

            {/* WebView Content */}
            <View style={{ flex: 1 }}>
              <iframe
                src={url}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Job Details"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // For mobile, use React Native WebView
  if (!WebView || !url) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={() => {}} // Prevent Android back button from closing
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <Animated.View
          style={{
            backgroundColor: bgColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: screenHeight * 0.9,
            paddingBottom: insets.bottom,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: textColor,
              }} numberOfLines={1}>
                {url.length > 50 ? url.substring(0, 50) + '...' : url}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.8)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="x" size={20} color={textColor} />
            </Pressable>
          </View>

          {/* Drag Handle */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: borderColor,
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 8,
            marginBottom: 4,
          }} />

          {/* WebView Content */}
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: url }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
