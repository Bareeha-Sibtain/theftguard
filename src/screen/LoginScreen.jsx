import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useUser } from '../context/userContext';  // Make sure the path is correct
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initializing, setInitializing] = useState(true);
  const { setUser } = useUser();  // Correctly using setUser from context
  const navigation = useNavigation()

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);  // Set user in context right here
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;  // Loading or splash screen should be here

  const handleLogin = () => {
    if(email === '' || password === ''){
      Alert.alert("Error", "Please Fill All the Inputs")
    }else{
      auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Success', 'Logged in!');
        setEmail('')
        setPassword('')
        navigation.navigate("Drawer", { screen: "Home" });
      })
      .catch(error => {
        // Check the correct error codes and handle them
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'The email address or password is invalid!');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'The password is incorrect!');
        } else {
          Alert.alert('Error', error.message);  // General error
        }
      });
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Login</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email / Username"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#000"
        />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleLogin}>
          <Text style={styles.registerButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.loginText}>Don't have an Account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'gray',
    marginTop: 20,
  },
});

export default LoginScreen;
