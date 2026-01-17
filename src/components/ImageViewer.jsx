import React from 'react';
import { View, Modal, Pressable, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ImageViewer = ({ visible, imageUri, onClose, darkMode }) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  if (!imageUri) {
    return null;
  }

  const bgColor = darkMode ? '#000000' : '#000000'; // Always black background for image viewer

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Close Button */}
        <Pressable
          onPress={onClose}
          style={{
            position: 'absolute',
            top: insets.top + 16,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}
        >
          <Icon name="x" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Image */}
        <View
          style={{
            width: screenWidth - 32,
            height: screenHeight - 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImageViewer;
