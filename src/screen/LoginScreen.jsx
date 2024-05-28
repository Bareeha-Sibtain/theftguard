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
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useUser } from '../context/userContext';  // Make sure the path is correct
import { useNavigation } from '@react-navigation/native';
import {logo} from '../assets/image/logo.jpeg'

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
        navigation.navigate("/home");
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
          <Image style={styles.image} source={require('../assets/image/logo.jpeg')} />
          <Text style={styles.logoText}>TheftGuard</Text>
          <Text style={styles.logedText}>Login</Text>
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
  image: {
    width: 200, // Set the width of your image
    height: 200, // Set the height of your image
},
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20
  },
  logoText:{
    fontSize: 30,
    fontFamily: 'cursive',
    fontWeight: 'bold',
    color: '#000'
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
    backgroundColor: '#2563EB',
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
    color: '#2563EB',
    marginTop: 20,
  },
});

export default LoginScreen;
