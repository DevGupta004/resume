// Simple test to verify React Native Web is working
import React from 'react';
import { View, Text } from 'react-native';

const TestApp = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, color: '#000' }}>Hello World - React Native Web Works!</Text>
    </View>
  );
};

export default TestApp;
