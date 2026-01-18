import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import emailjs from 'emailjs-com';
import Icon from 'react-native-vector-icons/Feather';
import { openURL } from '../utils/linking';
import { isWeb } from '../utils/platform';
import { resumeData } from '../data/resumeData';

const Contact = ({ darkMode = false }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const cardBg = darkMode ? '#1F2937' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#D1D5DB';
  const placeholderColor = darkMode ? '#6B7280' : '#9CA3AF';
  const iconColor = darkMode ? '#9CA3AF' : '#374151';
  const linkColor = darkMode ? '#60A5FA' : '#1E88E5';

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      return;
    }

    // For web, use EmailJS
    if (isWeb) {
      // TODO: Replace with your EmailJS service details
      emailjs
        .send('service_id', 'template_id', form, 'public_key')
        .then(() => setSent(true))
        .catch((err) => console.error(err));
    } else {
      // For mobile, use mailto link
      const mailtoLink = `mailto:${resumeData.email}?subject=Contact from ${form.name}&body=${encodeURIComponent(form.message)}`;
      openURL(mailtoLink);
      setSent(true);
    }
  };

  const inputPadding = isWeb ? 16 : 12;
  const inputFontSize = isWeb ? 16 : 14;
  const containerMaxWidth = isWeb ? 900 : 768;
  const containerPadding = isWeb ? 32 : 16;
  const formGap = isWeb ? 24 : 16;
  const titleFontSize = isWeb ? 36 : 30;
  const buttonPadding = isWeb ? 16 : 12;
  const messageMinHeight = isWeb ? 150 : 100;

  return (
    <View id="contact" style={{ paddingVertical: isWeb ? 100 : 80, backgroundColor: bgColor }}>
      <View style={{ 
        maxWidth: containerMaxWidth, 
        marginHorizontal: 'auto', 
        paddingHorizontal: containerPadding,
        width: '100%',
      }}>
        <Text style={{ 
          fontSize: titleFontSize, 
          fontWeight: '600', 
          marginBottom: isWeb ? 40 : 24, 
          textAlign: 'center', 
          color: textColor 
        }}>
          Contact
        </Text>
        {sent ? (
          <View style={{ 
            paddingVertical: isWeb ? 60 : 40,
            alignItems: 'center',
          }}>
            <Text style={{ 
              textAlign: 'center', 
              color: linkColor, 
              fontSize: isWeb ? 20 : 18,
              fontWeight: '500',
            }}>
              Thank you for your message!
            </Text>
          </View>
        ) : (
          <View style={{ gap: formGap }}>
            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(value) => handleChange('name', value)}
              style={{
                padding: inputPadding,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
                fontSize: inputFontSize,
                ...(isWeb && {
                  minHeight: 52,
                }),
              }}
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                padding: inputPadding,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
                fontSize: inputFontSize,
                ...(isWeb && {
                  minHeight: 52,
                }),
              }}
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              placeholder="Message"
              value={form.message}
              onChangeText={(value) => handleChange('message', value)}
              multiline
              numberOfLines={isWeb ? 6 : 4}
              textAlignVertical="top"
              style={{
                padding: inputPadding,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
                minHeight: messageMinHeight,
                fontSize: inputFontSize,
              }}
              placeholderTextColor={placeholderColor}
            />
            <Pressable
              onPress={handleSubmit}
              style={{
                backgroundColor: linkColor,
                paddingVertical: buttonPadding,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: darkMode ? 0.5 : 0.3,
                shadowRadius: 6,
                elevation: 5,
                ...(isWeb && {
                  minHeight: 56,
                  cursor: 'pointer',
                }),
              }}
            >
              <Text style={{ 
                color: '#FFFFFF', 
                fontWeight: '600', 
                textAlign: 'center',
                fontSize: isWeb ? 17 : 15,
              }}>
                Send Message
              </Text>
            </Pressable>
          </View>
        )}
        <View style={{ 
          marginTop: isWeb ? 48 : 32, 
          flexDirection: 'row', 
          justifyContent: 'center', 
          gap: isWeb ? 32 : 24,
        }}>
          <Pressable 
            onPress={() => openURL(resumeData.github)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: isWeb ? 12 : 8,
              borderRadius: 8,
              ...(isWeb && {
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }),
            })}
          >
            <Icon name="github" size={isWeb ? 28 : 24} color={iconColor} />
          </Pressable>
          <Pressable 
            onPress={() => openURL(resumeData.linkedin)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: isWeb ? 12 : 8,
              borderRadius: 8,
              ...(isWeb && {
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }),
            })}
          >
            <Icon name="linkedin" size={isWeb ? 28 : 24} color={iconColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Contact;
