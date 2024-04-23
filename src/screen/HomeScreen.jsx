//import liraries
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';

// create a component
const HomeScreen = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => Logout()}>
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
      ),
    });
  }, []);

  const Logout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.navigate('Login');
      });
  };

  return (
    <View>
      <Text style={styles.textColor}>Welcome!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColor: {
    color: 'red',
  },
});
export default HomeScreen;
