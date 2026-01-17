import { Platform, Alert } from 'react-native';
import { isWeb } from './platform';
import { storage } from './storage';

const PROFILE_IMAGE_KEY = 'profile_image_uri';

/**
 * Get profile image URI from storage
 */
export const getProfileImage = async () => {
  try {
    const uri = await storage.getItem(PROFILE_IMAGE_KEY);
    return uri || null;
  } catch (error) {
    console.error('Error getting profile image:', error);
    return null;
  }
};

/**
 * Save profile image URI to storage
 */
export const saveProfileImage = async (uri) => {
  try {
    await storage.setItem(PROFILE_IMAGE_KEY, uri);
    return true;
  } catch (error) {
    console.error('Error saving profile image:', error);
    return false;
  }
};

/**
 * Remove profile image from storage
 */
export const removeProfileImage = async () => {
  try {
    await storage.setItem(PROFILE_IMAGE_KEY, '');
    return true;
  } catch (error) {
    console.error('Error removing profile image:', error);
    return false;
  }
};

/**
 * Pick image for web platform
 */
export const pickImageWeb = () => {
  return new Promise((resolve, reject) => {
    if (!isWeb || typeof document === 'undefined') {
      reject(new Error('Web platform not available'));
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Selected file is not an image'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (dataUrl) {
          resolve(dataUrl);
        } else {
          reject(new Error('Failed to read image'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    };

    input.oncancel = () => reject(new Error('Image selection cancelled'));
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

/**
 * Pick image for mobile platform
 */
export const pickImageMobile = async () => {
  const { Alert } = require('react-native');
  
  // Check if react-native-image-picker is available
  // On web, this will be false due to webpack alias, so we skip it
  let ImagePicker;
  try {
    // Use dynamic require with try-catch to handle webpack exclusion
    const imagePickerModule = require('react-native-image-picker');
    ImagePicker = imagePickerModule;
    
    // Verify the module has the required method
    if (!ImagePicker || typeof ImagePicker.launchImageLibrary !== 'function') {
      throw new Error('Image picker module not properly loaded');
    }
  } catch (e) {
    // Library not installed, not properly configured, or excluded on web
    // On web, this is expected and we should never reach here
    // On mobile, show helpful message
    if (!isWeb) {
      return new Promise((resolve, reject) => {
        Alert.alert(
          'Image Picker Not Available',
          'Please install react-native-image-picker to enable image upload on mobile:\n\nyarn add react-native-image-picker\n\nThen follow the setup instructions in the package documentation.',
          [
            { 
              text: 'OK', 
              onPress: () => reject(new Error('Image picker not available. Please install react-native-image-picker.')) 
            }
          ]
        );
      });
    } else {
      // On web, this should never happen, but handle gracefully
      throw new Error('Image picker not available on web');
    }
  }
  
  return new Promise((resolve, reject) => {
    try {
      const options = {
        title: 'Select Profile Picture',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          reject(new Error('Image selection cancelled'));
        } else if (response.errorMessage) {
          reject(new Error(response.errorMessage));
        } else if (response.assets && response.assets[0]) {
          resolve(response.assets[0].uri);
        } else {
          reject(new Error('No image selected'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Main function to pick image (works on both web and mobile)
 */
export const pickImage = async () => {
  try {
    if (isWeb) {
      return await pickImageWeb();
    } else {
      return await pickImageMobile();
    }
  } catch (error) {
    // Don't log expected errors (like user cancellation or library not installed)
    if (error.message && (
      error.message.includes('not available') || 
      error.message.includes('cancelled')
    )) {
      throw error;
    }
    console.error('Error picking image:', error);
    throw error;
  }
};

/**
 * Upload and save profile image
 */
export const uploadProfileImage = async () => {
  try {
    const imageUri = await pickImage();
    if (imageUri) {
      const saved = await saveProfileImage(imageUri);
      if (saved) {
        return imageUri;
      }
    }
    return null;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
