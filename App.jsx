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


const AuthStack = () => {

  


  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const App = () => {

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
  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: "theftguard1234", // same as the one you use to send a notification
        channelName: "Theftguard Notifications", // human-readable name, displayed in settings
        channelDescription: "A channel to categorise Theftguard alerts", // description of the channel
        soundName: "default", // the sound name to play
        importance: 4, // Importance level, similar to importance levels in Android
        vibrate: true, // Whether to vibrate
      },
      (created) => console.log(`CreateChannel returned '${created}'`) // callback returns whether the channel was created successfully
    );
  };
  
  useEffect(()=>{
    createNotificationChannel()
  },[])

  
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
