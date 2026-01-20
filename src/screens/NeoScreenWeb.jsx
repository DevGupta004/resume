import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
// Web-only AI service - no mobile dependencies
import { generateAIResponse } from '../utils/aiServiceWeb';

const NeoScreenWeb = ({ darkMode = false }) => {
  const insets = useSafeAreaInsets();
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const headerBg = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi there! 👋 I'm Dev Gupta, and I'm available 24/7 to answer your questions! Feel free to ask me about my experience, skills, projects, or anything else you'd like to know. I'm here to help!`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // Generate AI response using the AI service (fallback system for web)
      const aiResponseText = await generateAIResponse(currentInput);
      
      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Blinking animation for "Thinking..." text
  useEffect(() => {
    if (isLoading) {
      // Start blinking animation
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    } else {
      // Reset opacity when not loading
      blinkAnim.setValue(1);
    }
  }, [isLoading]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior="padding"
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 64 + 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sender === 'ai' && (
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#1E88E5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}>AI</Text>
              </View>
            )}
            <View style={{
              maxWidth: '75%',
              backgroundColor: message.sender === 'user' 
                ? '#1E88E5' 
                : (darkMode ? '#1F2937' : '#F3F4F6'),
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 18,
              borderBottomLeftRadius: message.sender === 'ai' ? 4 : 18,
              borderBottomRightRadius: message.sender === 'user' ? 4 : 18,
            }}>
              <Text style={{
                fontSize: 15,
                color: message.sender === 'user' 
                  ? '#FFFFFF' 
                  : (darkMode ? '#E5E7EB' : '#111827'),
                lineHeight: 20,
              }}>
                {message.text}
              </Text>
            </View>
            {message.sender === 'user' && (
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: darkMode ? '#6B7280' : '#9CA3AF',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}>
                <Icon name="user" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={{
            flexDirection: 'row',
            marginBottom: 16,
            justifyContent: 'flex-start',
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#1E88E5',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}>AI</Text>
            </View>
            <View style={{
              backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 18,
              borderBottomLeftRadius: 4,
            }}>
              <Animated.Text style={{
                fontSize: 15,
                color: darkMode ? '#E5E7EB' : '#111827',
                opacity: blinkAnim,
              }}>
                Thinking...
              </Animated.Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={{
        paddingBottom: 16,
        paddingTop: 12,
        paddingHorizontal: 16,
        backgroundColor: headerBg,
        borderTopWidth: 1,
        borderTopColor: borderColor,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
          borderRadius: 24,
          paddingHorizontal: 4,
          paddingVertical: 4,
          borderWidth: 1,
          borderColor: borderColor,
        }}>
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 15,
              color: textColor,
              maxHeight: 100,
            }}
            placeholder="Ask about Dev's experience, skills, projects..."
            placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={inputText.trim() === '' || isLoading}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: (inputText.trim() === '' || isLoading)
                ? (darkMode ? '#374151' : '#D1D5DB') 
                : '#1E88E5',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 4,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Icon name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NeoScreenWeb;
