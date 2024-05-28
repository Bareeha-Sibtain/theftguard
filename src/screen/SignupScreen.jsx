import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Button,
  Alert,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // State for storing the user's name
  const [phone, setPhone] = useState(''); // State for storing the user's phone
  const [location, setLocation] = useState(''); // State for storing the user's phone

  const handleRegister = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Update the user profile with the name provided
        userCredential.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            // User profile updated successfully
            // Now add a new document in Firestore
            const userRef = firestore()
              .collection('users')
              .doc(userCredential.user.uid);
            return userRef.set({
              name: name,
              email: email,
              phone: phone,
              location:location,
              createdAt: firestore.FieldValue.serverTimestamp(), // Adds a server-side timestamp
            });
          });
      })
      .then(() => {
        Alert.alert('Success', 'User account created & signed in!');
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setLocation('')
        navigation.navigate('Drawer', {screen: 'Home'});
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This Email is already in use');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.logoContainer}>
          <Image style={styles.image} source={require('../assets/image/logo.jpeg')} />
          <Text style={styles.logoText}>TheftGuard</Text>
          <Text style={styles.logedText}>Register</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#000"
        />

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
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#000"
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#000"
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegister({navigation})}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
  image: {
    width: 200, // Set the width of your image
    height: 200, // Set the height of your image
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

export default SignupScreen;
