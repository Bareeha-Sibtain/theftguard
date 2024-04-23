

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/LoginScreen';
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerNavigator from './src/navigation/DrawerNavigator';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
function App() {


  return (
  <NavigationContainer>
     <Stack.Navigator>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Drawer' component={DrawerNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
   </NavigationContainer>
  );
}



export default App;
