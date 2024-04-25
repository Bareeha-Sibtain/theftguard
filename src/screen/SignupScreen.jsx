import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import auth from '@react-native-firebase/auth';

const SignupScreen = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // State for storing the user's name

  const handleRegister = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Update the user profile with the name provided
        return userCredential.user.updateProfile({
          displayName: name
        });
      })
      .then(() => {
        Alert.alert('Success', 'User account created & signed in!');
        setEmail('');
        setPassword('');
        setName('');
        navigation.navigate("Drawer", { screen: "Home" });
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
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>REGISTER</Text>
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

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegister({navigation})}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>

        <Button title="Go Login" onPress={() => navigation.navigate('Login')} />
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

export default SignupScreen;
