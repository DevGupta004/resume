import { Linking, Platform } from 'react-native';

export const openURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open URI: ${url}`);
    }
  } catch (error) {
    console.error('Error opening URL:', error);
  }
};

export const openWhatsApp = (phoneNumber) => {
  const cleanNumber = phoneNumber.replace(/\s+/g, '');
  const url = Platform.select({
    ios: `whatsapp://send?phone=${cleanNumber}`,
    android: `whatsapp://send?phone=${cleanNumber}`,
    web: `https://wa.me/${cleanNumber}`,
  });
  openURL(url);
};

export const openEmail = (email) => {
  const url = `mailto:${email}`;
  openURL(url);
};

export const downloadPDF = (pdfPath) => {
  if (Platform.OS === 'web') {
    // For web, open in new tab or trigger download
    openURL(pdfPath);
  } else {
    // For mobile, you'll need react-native-share or react-native-fs
    // This is a placeholder - implement based on your needs
    console.log('PDF download for mobile not yet implemented');
  }
};
