// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import SettingScreen from '../screen/SettingScreen';  // Example of another screen
import 'react-native-gesture-handler'
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Setting" component={SettingScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
