import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { isWeb } from '../utils/platform';
import { resumeData } from '../data/resumeData';

const NeoScreen = ({ darkMode = false }) => {
  const insets = useSafeAreaInsets();
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const headerBg = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm Dev's AI Assistant. I can answer questions about Dev Gupta's experience, skills, projects, and background. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);

  // AI Agent function to generate responses based on resume data
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      return `Hello! I'm Dev's AI Assistant. I can help you learn about Dev Gupta's professional background, skills, experience, and projects. What would you like to know?`;
    }

    // About/Introduction
    if (message.match(/(who is|tell me about|introduce|about dev|background|overview)/)) {
      return `Dev Gupta is a passionate and performance-driven Full Stack & Mobile App Developer with 4.5+ years of experience. He specializes in delivering scalable, AI-powered solutions in fintech, OTT media, and enterprise environments. Currently based in Hyderabad, Dev has a proven track record of building robust mobile and web applications using React Native, Node.js, and scalable microservices.`;
    }

    // Experience
    if (message.match(/(experience|work|job|career|employment|current role|where does|company)/)) {
      const currentExp = resumeData.experience[0];
      return `Dev is currently working as a ${currentExp.role} at ${currentExp.company} in ${currentExp.location} (${currentExp.period}). His key responsibilities include:\n\n• ${currentExp.details[0]}\n• ${currentExp.details[1]}\n• ${currentExp.details[2]}\n\nPreviously, Dev worked at Ambak, Cutting Edge Digital (Mogi I/O), and ITCell, gaining diverse experience in fintech, OTT platforms, and enterprise solutions.`;
    }

    // Skills
    if (message.match(/(skill|technology|tech stack|what can|proficient|expertise|knows|proficient in)/)) {
      const skillsList = resumeData.skills.slice(0, 10).join(', ');
      return `Dev is skilled in various technologies including:\n\n${skillsList}\n\nAnd many more. He has strong expertise in React Native, React.js, Node.js, MongoDB, MySQL, and building scalable microservices architectures.`;
    }

    // Projects
    if (message.match(/(project|built|developed|portfolio|github|work sample)/)) {
      const projectsList = resumeData.projects.map(p => 
        `• ${p.title} - ${p.description} (Tech: ${p.tech.join(', ')})`
      ).join('\n\n');
      return `Dev has worked on several notable projects:\n\n${projectsList}\n\nYou can find more details about his work on his GitHub profile.`;
    }

    // Education (if asked, provide a general response)
    if (message.match(/(education|degree|university|college|qualification|studied)/)) {
      return `I don't have specific education details in my database, but Dev has 4.5+ years of professional experience demonstrating strong technical skills and expertise in full-stack and mobile development.`;
    }

    // Contact information
    if (message.match(/(contact|email|phone|reach|get in touch|linkedin|github|how to contact)/)) {
      return `You can reach Dev through:\n\n📧 Email: ${resumeData.email}\n📱 Phone: ${resumeData.phone}\n💼 LinkedIn: ${resumeData.linkedin}\n💻 GitHub: ${resumeData.github}\n\nFeel free to connect with him for opportunities or collaborations!`;
    }

    // Location
    if (message.match(/(location|where|based|city|address|live)/)) {
      return `Dev is currently based in ${resumeData.location}. He's open to remote opportunities and willing to relocate for the right opportunity.`;
    }

    // Availability/Open to work
    if (message.match(/(available|open to|looking for|hiring|opportunity|job|position|role)/)) {
      return `Dev is currently working as a Senior Software Engineer at Innovapptive Inc. However, he's always open to discussing exciting opportunities, especially in full-stack development, mobile app development, or AI-powered solutions. Feel free to reach out via email or LinkedIn!`;
    }

    // Years of experience
    if (message.match(/(how long|years|experience|tenure|duration)/)) {
      return `Dev has 4.5+ years of professional experience in software development, with expertise spanning full-stack development, mobile app development, and building scalable microservices.`;
    }

    // Specific technologies
    if (message.match(/(react native|react\.js|node\.js|mongodb|mysql|express|nestjs|redux|firebase)/)) {
      const tech = message.match(/(react native|react\.js|node\.js|mongodb|mysql|express|nestjs|redux|firebase)/i)?.[0];
      return `Yes, Dev has extensive experience with ${tech}. He has used it in multiple projects including OTT platforms, fintech applications, and enterprise solutions. ${tech} is one of his core competencies.`;
    }

    // Default response
    return `I'm Dev's AI Assistant, and I can help answer questions about:\n\n• His professional experience and current role\n• Technical skills and expertise\n• Projects and portfolio\n• Contact information\n• Background and career journey\n\nCould you please rephrase your question? I'm here to help HR professionals learn more about Dev Gupta!`;
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

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

    // Generate AI response based on user message
    setTimeout(() => {
      const aiResponseText = generateAIResponse(currentInput);
      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 800); // Slightly faster response for better UX
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : isWeb ? 0 : 100} // Account for bottom tabs on mobile
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: isWeb ? insets.top + 64 + 16 : insets.top + 56 + 16,
          paddingBottom: isWeb ? 16 : 70, // Add bottom padding for input area + compact bottom tabs
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
      </ScrollView>

      {/* Input Area */}
      <View style={{
        paddingBottom: isWeb ? 16 : insets.bottom + 70, // Add space for compact bottom tabs (56px + padding + safe area)
        paddingTop: 12,
        paddingHorizontal: 16,
        backgroundColor: headerBg,
        borderTopWidth: 1,
        borderTopColor: borderColor,
        zIndex: 100, // Ensure input area is above bottom tabs
        elevation: 100, // Android elevation
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
            disabled={inputText.trim() === ''}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: inputText.trim() === '' 
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

export default NeoScreen;
