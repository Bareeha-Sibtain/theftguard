// ChatStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screen/ChatListScreen';
import ChatScreen from '../screen/ChatScreen';

const Stack = createNativeStackNavigator();

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen}  />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;

// screenOptions={{
//     headerShown: false
//   }}