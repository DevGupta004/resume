import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform, Modal, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { isWeb } from '../utils/platform';
import { generateAIResponse, initAIService, isOfflineModelAvailable } from '../utils/aiService';
import { checkModelExists } from '../utils/modelManager';
import ModelDownloadScreen from './ModelDownloadScreen';

const NeoScreenMobile = ({ darkMode = false }) => {
  // All hooks must be called before any conditional returns
  const [showDownloadScreen, setShowDownloadScreen] = useState(false);
  const insets = useSafeAreaInsets();
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const headerBg = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [modelExists, setModelExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingAI, setIsPreparingAI] = useState(false);
  const scrollViewRef = useRef(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const preparingAnim = useRef(new Animated.Value(1)).current;

  // Check model status on mount and when returning from download screen
  useEffect(() => {
    const checkModel = async () => {
      try {
        const exists = await checkModelExists();
        setModelExists(exists);
        if (exists) {
          // Initialize AI service if model exists
          setIsPreparingAI(true);
          try {
            const initialized = await initAIService();
            // Show welcome message when model is first loaded
            if (initialized) {
              setMessages(prev => {
                // Only add welcome message if messages array is empty
                if (prev.length === 0) {
                  return [{
                    id: 1,
                    text: `Hi there! 👋 I'm Dev Gupta, and I'm available 24/7 to answer your questions! Feel free to ask me about my experience, skills, projects, or anything else you'd like to know. I'm here to help!`,
                    sender: 'ai',
                    timestamp: new Date(),
                  }];
                }
                return prev;
              });
            }
          } finally {
            setIsPreparingAI(false);
          }
        }
      } catch (error) {
        console.warn('Error checking model:', error);
        setModelExists(false);
        setIsPreparingAI(false);
      }
    };
    checkModel();
  }, [showDownloadScreen]); // Re-check when returning from download screen

  const handleSend = async () => {
    // Don't allow sending if model is not available
    if (!isOfflineModelAvailable() || !modelExists) {
      return;
    }

    if (inputText.trim() === '' || isLoading || isPreparingAI) return;

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
    
    // Check if model needs to be initialized
    if (!isOfflineModelAvailable()) {
      setIsPreparingAI(true);
    } else {
      setIsLoading(true);
    }

    try {
      // Generate AI response using the AI service
      // This will initialize the model if needed
      const aiResponseText = await generateAIResponse(currentInput);
      
      if (aiResponseText) {
        const aiResponse = {
          id: messages.length + 2,
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }
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
      setIsPreparingAI(false);
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
  }, [isLoading, blinkAnim]);

  // Blinking animation for "Preparing AI..." text
  useEffect(() => {
    if (isPreparingAI) {
      // Start blinking animation
      const preparingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(preparingAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(preparingAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      preparingAnimation.start();
      return () => preparingAnimation.stop();
    } else {
      // Reset opacity when not preparing
      preparingAnim.setValue(1);
    }
  }, [isPreparingAI, preparingAnim]);

  // Check if model is loaded and available
  const isModelReady = modelExists && isOfflineModelAvailable();

  // Always render the same component structure, conditionally show content
  return (
    <>
      {showDownloadScreen ? (
        <ModelDownloadScreen darkMode={darkMode} onBack={() => setShowDownloadScreen(false)} />
      ) : !modelExists ? (
        // Show download button when model is not downloaded
        <View style={{ flex: 1, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: darkMode ? '#1E3A5F' : '#DBEAFE',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Icon name="download" size={48} color={darkMode ? '#60A5FA' : '#2563EB'} />
          </View>
          <Text style={{
            color: textColor,
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Dev Clone AI
          </Text>
          <Text style={{
            color: darkMode ? '#9CA3AF' : '#6B7280',
            fontSize: 16,
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            Download the AI model to start chatting with Dev's AI assistant. The model works completely offline.
          </Text>
          <Pressable
            onPress={() => setShowDownloadScreen(true)}
            style={{
              backgroundColor: '#1E88E5',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 200,
            }}
          >
            <Icon 
              name="download" 
              size={20} 
              color="#FFFFFF" 
              style={{ marginRight: 10 }} 
            />
            <Text style={{ 
              color: '#FFFFFF', 
              fontSize: 16, 
              fontWeight: '600' 
            }}>
              Download Dev Clone AI
            </Text>
          </Pressable>
          <Text style={{
            color: darkMode ? '#6B7280' : '#9CA3AF',
            fontSize: 12,
            marginTop: 16,
            textAlign: 'center',
          }}>
            Model size: ~400MB - 1.1GB
          </Text>
        </View>
      ) : !isModelReady ? (
        // Show preparing screen when model is downloaded but not initialized
        <View style={{ flex: 1, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: darkMode ? '#1E3A5F' : '#DBEAFE',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Animated.View style={{ opacity: preparingAnim }}>
              <Icon name="loader" size={48} color={darkMode ? '#60A5FA' : '#2563EB'} />
            </Animated.View>
          </View>
          <Text style={{
            color: textColor,
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Dev Clone AI
          </Text>
          <Animated.Text style={{
            color: darkMode ? '#60A5FA' : '#2563EB',
            fontSize: 18,
            marginBottom: 12,
            textAlign: 'center',
            fontWeight: '600',
            opacity: preparingAnim,
          }}>
            Preparing Dev AI Clone for offline use...
          </Animated.Text>
          <Text style={{
            color: darkMode ? '#9CA3AF' : '#6B7280',
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Please wait while we load the AI model. This may take a few moments.
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: bgColor }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : isWeb ? 0 : 100}
        >
      {/* Change Model Button - Mobile Only */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: insets.top + 12,
        paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => setShowDownloadScreen(true)}
          style={{
            backgroundColor: darkMode ? '#374151' : '#F3F4F6',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon 
            name="settings" 
            size={18} 
            color={darkMode ? '#E5E7EB' : '#111827'} 
            style={{ marginRight: 8 }} 
          />
          <Text style={{ 
            color: darkMode ? '#E5E7EB' : '#111827', 
            fontSize: 15, 
            fontWeight: '600' 
          }}>
            Change Model
          </Text>
        </Pressable>
      </View>

      {/* Preparing AI Indicator */}
      {isPreparingAI && (
        <View style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          <View style={{
            backgroundColor: darkMode ? '#1E3A5F' : '#DBEAFE',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="loader" size={16} color={darkMode ? '#60A5FA' : '#2563EB'} style={{ marginRight: 6 }} />
            <Animated.Text style={{
              color: darkMode ? '#60A5FA' : '#2563EB',
              fontSize: 13,
              fontWeight: '500',
              opacity: preparingAnim,
            }}>
              Preparing AI...
            </Animated.Text>
          </View>
        </View>
      )}

      {/* Offline Model Indicator */}
      {modelExists && isOfflineModelAvailable() && !isPreparingAI && (
        <View style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          <View style={{
            backgroundColor: darkMode ? '#065F46' : '#D1FAE5',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="check-circle" size={16} color={darkMode ? '#10B981' : '#059669'} style={{ marginRight: 6 }} />
            <Text style={{
              color: darkMode ? '#10B981' : '#059669',
              fontSize: 13,
              fontWeight: '500',
            }}>
              Offline AI Model Active
            </Text>
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
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
        paddingBottom: insets.bottom + 68, // Account for bottom tabs (56px + 12px padding)
        paddingTop: 12,
        paddingHorizontal: 16,
        backgroundColor: headerBg,
        borderTopWidth: 1,
        borderTopColor: borderColor,
        zIndex: 100,
        elevation: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: darkMode ? 0.3 : 0.08,
        shadowRadius: 8,
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
            editable={isModelReady && !isPreparingAI}
          />
          <Pressable
            onPress={handleSend}
            disabled={inputText.trim() === '' || isLoading || isPreparingAI || !isModelReady}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: (inputText.trim() === '' || isLoading || isPreparingAI || !isModelReady)
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
      )}
    </>
  );
};

export default NeoScreenMobile;
