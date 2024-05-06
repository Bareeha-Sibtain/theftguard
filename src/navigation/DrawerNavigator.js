// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import SettingScreen from '../screen/SettingScreen';  // Example of another screen
import 'react-native-gesture-handler'
import { Image, TouchableOpacity } from 'react-native';
const Drawer = createDrawerNavigator();
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import ChatScreen from '../screen/ChatScreen';
import ChatListScreen from '../screen/ChatListScreen';
import ChatStackNavigator from './ChatStackNavigator';
import HistoryScreen from '../screen/HistoryScreen';

const DrawerNavigator = () => {
  const navigation = useNavigation()

  const Logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('Login');
      });
  };

  return (
    <Drawer.Navigator 
    initialRouteName="Home"
    screenOptions={{
      headerRight: () => (
        <TouchableOpacity
        onPress={() => Logout()}
        >
          <Image
            source={{
              uri: 'https://toppng.com/uploads/preview/logout-11551049168o9cg0mxxib.png',
            }}
            style={{
              width: 20,
              height: 20,
              marginRight: 20,
            }}
          />
        </TouchableOpacity>
      )
    }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
