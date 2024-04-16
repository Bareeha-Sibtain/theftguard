import React, {useState, useEff} from 'react';
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

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform validation and registration logic
    // alert('Login button pressed!');
    
    auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      Alert.alert('Success','Logged in!');
      navigation.navigate("Home")
    })
    .catch(error => {
      console.log(error);
  
      if (error.code === 'credential is incorrect') {
        Alert.alert('Error','The email address or password is invalid!');
      }
  
      console.error(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>REGISTER</Text>
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
          onPress={() => handleLogin({navigation})}>
          <Text style={styles.registerButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.loginText} onPress={() => navigation.navigate('Signup')}>Don't have an Account?</Text>
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
  placeholder:{
    color: "#000"
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
