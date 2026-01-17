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

  return (
    <View id="contact" style={{ paddingVertical: 80, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 768, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, textAlign: 'center', color: textColor }}>
          Contact
        </Text>
        {sent ? (
          <Text style={{ textAlign: 'center', color: linkColor, fontSize: 18 }}>
            Thank you for your message!
          </Text>
        ) : (
          <View style={{ gap: 16 }}>
            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(value) => handleChange('name', value)}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
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
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
              }}
              placeholderTextColor={placeholderColor}
            />
            <TextInput
              placeholder="Message"
              value={form.message}
              onChangeText={(value) => handleChange('message', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: borderColor,
                backgroundColor: cardBg,
                color: textColor,
                minHeight: 100,
              }}
              placeholderTextColor={placeholderColor}
            />
            <Pressable
              onPress={handleSubmit}
              style={{
                backgroundColor: linkColor,
                paddingVertical: 12,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: darkMode ? 0.5 : 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600', textAlign: 'center' }}>Send Message</Text>
            </Pressable>
          </View>
        )}
        <View style={{ marginTop: 32, flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
          <Pressable onPress={() => openURL(resumeData.github)}>
            <Icon name="github" size={24} color={iconColor} />
          </Pressable>
          <Pressable onPress={() => openURL(resumeData.linkedin)}>
            <Icon name="linkedin" size={24} color={iconColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Contact;
