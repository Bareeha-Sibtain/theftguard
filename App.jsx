// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, useUser } from './src/context/userContext';
import LoginScreen from './src/screen/LoginScreen'
import SignupScreen from './src/screen/SignupScreen';
import HomeScreen from './src/screen/HomeScreen';
import LoadingScreen from './src/screen/LoadingScreen';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { Alert } from 'react-native';
import ChatScreen from './src/screen/ChatScreen';

const Stack = createNativeStackNavigator();

import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
  },
  // Android only: GCM or FCM Sender ID
  senderID: '478436791531',
  popInitialNotification: true,
  requestPermissions: true,
});

// Define a channel
PushNotification.createChannel(
  {
    channelId: "theftguard1234", // provide a unique ID for the channel
    channelName: "theftguard", // provide a channel name
    channelDescription: "To detect any robber", // provide a channel description
    playSound: true,
    soundName: "default", // plays a sound. Set to `customsound.mp3` in the `raw` folder or leave as 'default' for the default sound
    importance: 4, // importance and visibility go hand in hand
    vibrate: true, // whether to vibrate
  },
  (created) => console.log(`CreateChannel returned '${created}'`) // optional callback returns whether the channel was created successfully
);


const AuthStack = () => {

  


  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

const RootNavigator = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingScreen />; // Optionally handle loading state
  }

  return user ? <DrawerNavigator /> : <AuthStack />;
};

export default App;
