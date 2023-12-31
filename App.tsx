

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';


const Stack = createNativeStackNavigator();

function App() {


  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName='SignupScreen'>
      <Stack.Screen name='Signup' component={SignupScreen} />
      <Stack.Screen name='Login' component={LoginScreen}/>
      <Stack.Screen name='Home' component={HomeScreen}/>
        
        
      </Stack.Navigator>
   </NavigationContainer>
  );
}



export default App;
