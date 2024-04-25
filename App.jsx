// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, useUser } from './src/context/userContext';
import LoginScreen from './src/screen/LoginScreen'
import SignupScreen from './src/screen/SignupScreen';
import HomeScreen from './src/screen/HomeScreen';
import LoadingScreen from './src/screen/LoadingScreen';
import DrawerNavigator from './src/navigation/DrawerNavigator';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
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
