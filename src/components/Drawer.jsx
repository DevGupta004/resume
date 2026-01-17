import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Animated, Platform, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '../utils/storage';
import { isWeb } from '../utils/platform';
import { resumeData } from '../data/resumeData';
import { getProfileImage, uploadProfileImage } from '../utils/imagePicker';
import ImageViewer from './ImageViewer';

const drawerItems = [
  { name: 'About', id: 'about', icon: 'user' },
  { name: 'Experience', id: 'experience', icon: 'briefcase' },
  { name: 'Projects', id: 'projects', icon: 'folder' },
  { name: 'Skills', id: 'skills', icon: 'code' },
  { name: 'Contact', id: 'contact', icon: 'mail' },
];

const Drawer = ({ visible, onClose, onNavigate, darkMode }) => {
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadProfileImage();
    }
  }, [visible]);

  const loadProfileImage = async () => {
    const uri = await getProfileImage();
    if (uri) {
      setProfileImageUri(uri);
    }
  };

  const handleProfileImagePress = () => {
    // Open image viewer if image exists, otherwise do nothing
    if (profileImageUri) {
      setImageViewerVisible(true);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const imageUri = await uploadProfileImage();
      if (imageUri) {
        setProfileImageUri(imageUri);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      // Only show alert if it's not a cancellation or expected error
      if (error.message && !error.message.includes('cancelled')) {
        Alert.alert('Error', error.message || 'Failed to upload profile picture');
      }
    }
  };

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleItemPress = (itemId) => {
    onNavigate(itemId);
    onClose();
  };

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const itemBgColor = darkMode ? '#1F2937' : '#F9FAFB';

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={onClose}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 280,
              backgroundColor: bgColor,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateX: slideAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 2, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
          {/* Header */}
          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
            marginBottom: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            <Pressable
              onPress={handleProfileImagePress}
              disabled={!profileImageUri}
              style={({ pressed }) => ({
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#1E88E5',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: darkMode ? '#374151' : '#E5E7EB',
                transform: [{ scale: pressed && profileImageUri ? 0.95 : 1 }],
                opacity: profileImageUri ? 1 : 1,
              })}
            >
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>
                    {resumeData.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                )}
              </Pressable>
              <Pressable onPress={onClose}>
                <Icon name="x" size={24} color={textColor} />
              </Pressable>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
              {resumeData.name}
            </Text>
            <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280', marginTop: 4 }}>
              {resumeData.title}
            </Text>
            <Pressable
              onPress={handleChangePhoto}
              style={({ pressed }) => ({
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.2)' : 'rgba(30, 136, 229, 0.1)',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Icon name="camera" size={16} color="#1E88E5" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#1E88E5' }}>
                Change Photo
              </Text>
            </Pressable>
          </View>

          {/* Menu Items */}
          <View style={{ flex: 1 }}>
            {drawerItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleItemPress(item.id)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  marginHorizontal: 12,
                  marginVertical: 4,
                  borderRadius: 12,
                  backgroundColor: itemBgColor,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Icon name={item.icon} size={22} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: textColor,
                  marginLeft: 16,
                }}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Footer */}
          <View style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}>
            <Text style={{
              fontSize: 12,
              color: darkMode ? '#6B7280' : '#9CA3AF',
              textAlign: 'center',
            }}>
              Version 1.0.0
            </Text>
          </View>
        </Animated.View>
      </Pressable>
      </Modal>
      
      {/* Image Viewer Modal - rendered outside Drawer Modal */}
      <ImageViewer
        visible={imageViewerVisible}
        imageUri={profileImageUri}
        onClose={() => setImageViewerVisible(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default Drawer;
