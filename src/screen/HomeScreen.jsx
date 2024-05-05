import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {useUser} from '../context/userContext';
import firebase from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const HomeScreen = ({navigation}) => {
  const {user} = useUser();
  const [notification, setNotification] = useState(null);

  const fetchUserDetails = async userId => {
    try {
      const userDocument = await firestore()
        .collection('users')
        .doc(userId)
        .get();
      if (userDocument.exists) {
        console.log('User details fetched:', userDocument.data());
        return userDocument.data();
      } else {
        console.log('No user found with ID:', userId);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserDetails(user.uid).then(userDetails => {
        if (userDetails && userDetails.location) {
          console.log('Location set in state:', userDetails.location);
          setUpDeviceListener(userDetails.location); // Use location directly
        }
      });
    }

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);
        setNotification(notification); // Update the state with the received notification
      },
    });

    return () => {
      const reference = firebase().ref('Device');
      reference.off('value');
    };
  }, [user]);

  const setUpDeviceListener = location => {
    const reference = firebase().ref('Device');
    reference.on('value', snapshot => {
      const fetchData = snapshot.val();
      Object.keys(fetchData).forEach(homeKey => {
        const motionValue = fetchData[homeKey].motion?.value;
        const soundValue = fetchData[homeKey].sound?.value;
        if (motionValue === 1) {
          sendNotification(homeKey, 'motion', location);
        }
        if (soundValue === 1) {
          sendNotification(homeKey, 'sound', location);
        }
      });
    });
  };

  const sendNotification = (homeKey, detectionType, location) => {
    const message =
      detectionType === 'motion'
        ? `Motion detected at ${homeKey}. 
            Location: ${location}`
        : `Sound detected at ${homeKey}. 
             Location: ${location}`;

    PushNotification.localNotification({
      channelId: 'theftguard1234',
      title: 'Alert',
      message: message,
      playSound: true,
      soundName: 'default',
    });
  };

  const handleNotificationAction = (homeKey, action) => {
    const notificationsRef = firebase().ref('Notifications');
    notificationsRef.push({
      homeKey,
      action,
      user: user ? user.displayName : 'Anonymous',
      timestamp: new Date().toISOString(),
    });
    setNotification(null); // Clear notification from state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textColor}>
        Welcome! {user ? user.displayName : 'Guest'}
      </Text>
      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>Notification Received:</Text>
          <Text style={styles.notificationMessage}>
            {notification.title || 'No title'}
          </Text>
          <Text>{notification.message || 'No message'}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() =>
                handleNotificationAction(notification.homeKey, 'dismissed')
              }>
              <Text style={styles.btnColor}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnOk}
              onPress={() =>
                handleNotificationAction(notification.homeKey, 'accepted')
              }>
              <Text style={styles.btnColor}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  notificationContainer: {
    width: 300,
    height: 150,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnCancel: {
    width: 60,
    height: 30,
    backgroundColor: '#444',
    marginLeft: 15,
    padding: 5,
    borderRadius: 2,
    textAlign: 'center',
  },
  btnOk: {
    width: 60,
    height: 30,
    textAlign: 'center',
    backgroundColor: '#0000FF',
    marginLeft: 15,
    color: '#fff',
    padding: 5,
    borderRadius: 2,
  },
  btnColor: {
    color: '#FFF',
  },
});

export default HomeScreen;
