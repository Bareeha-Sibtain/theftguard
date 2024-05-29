import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useUser } from '../context/userContext';
import auth from '@react-native-firebase/auth';

const SettingScreen = ({ navigation }) => {
    const { user } = useUser();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
      const reauthenticate = (currentPassword) => {
          const currentUser = auth().currentUser;
          const credential = auth.EmailAuthProvider.credential(
              currentUser.email,
              currentPassword
          );
          return currentUser.reauthenticateWithCredential(credential);
      };
  
      const handleChangePassword = async () => {
          if (!currentPassword || !newPassword) {
              Alert.alert('Error', 'Please fill out all fields');
              return;
          }
  
          try {
              await reauthenticate(currentPassword);
              await auth().currentUser.updatePassword(newPassword);
              Alert.alert('Success', 'Password changed successfully');
              navigation.goBack();
          } catch (error) {
              console.error("Error changing password:", error);
              Alert.alert('Error', error.message);
          }
      };
  
      return (
          <View style={styles.container}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter your current password"
                  placeholderTextColor="#000" 
              />
              <Text style={styles.label}>New Password</Text>
              <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter your new password"
                  placeholderTextColor="#000" 
              />
              <Button title="Change Password" onPress={handleChangePassword} />
          </View>
      );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default SettingScreen;
