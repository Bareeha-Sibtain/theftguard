import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import { useUser } from '../context/userContext';
import firebase from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';  //Change
import PushNotification from 'react-native-push-notification';

const HomeScreen = ({ navigation }) => {
    const { user } = useUser();
    const [notification, setNotification] = useState(null);
    const [systemStatus, setSystemStatus] = useState(false); // change

    const fetchInitialSystemStatus = async () => {
        try {
            const homeKey = await fetchHomeKeyForUser(user.uid);
            if (!homeKey) {
                Alert.alert('Error', 'No home key found for this user.');
                return;
            }
            const reference = firebase().ref(`Device/${homeKey}`);
            reference.on('value', snapshot => {
                const data = snapshot.val();
                setSystemStatus(data.system_status === 1);
            });
        } catch (error) {
            console.error("Error fetching initial system status:", error);
        }
    };

    const fetchHomeKeyForUser = async (uid) => {
        try {
            const reference = firebase().ref('Device');
            const snapshot = await reference.once('value');
            const devices = snapshot.val();
            for (const key in devices) {
                if (devices[key].user && devices[key].user.uid === uid) {
                    return key;
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching home key for user:", error);
            return null;
        }
    };

    const handleToggle = async (value) => {
        try {
            const homeKey = await fetchHomeKeyForUser(user.uid);
            if (!homeKey) {
                Alert.alert('Error', 'No home key found for this user.');
                return;
            }
            const reference = firebase().ref(`Device/${homeKey}`);
            await reference.update({ system_status: value ? 1 : 0 });
            setSystemStatus(value);
            Alert.alert('System Status', `System status updated to ${value ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error("Error updating system status:", error);
        }
    };
    useEffect(() => {
        fetchInitialSystemStatus()
        setUpDeviceListener()

      PushNotification.configure({
        onNotification: function(notification) {
        //   console.log("Notification received:", notification);
          setNotification(notification); // Update the state with the received notification
        },
      });

      return () => {
        const reference = firebase().ref('Device');
        reference.off('value');
      };

    }, []);

    const setUpDeviceListener = () => {
      const reference = firebase().ref('Device');
      reference.on('value', snapshot => {
        const fetchData = snapshot.val();
        Object.keys(fetchData).forEach(homeKey => {
          const motionValue = fetchData[homeKey].motion?.value;
          const soundValue = fetchData[homeKey].sound?.value;
          const deviceLocation = fetchData[homeKey].user.location;
          const deviceName = fetchData[homeKey].user.name;
          if(fetchData[homeKey].system_status === 1){
            
            if (motionValue === 1) {
                sendNotification(homeKey, 'motion', deviceLocation, deviceName);
              }
              if (soundValue === 1) {
                sendNotification(homeKey, 'sound', deviceLocation, deviceName);
              }
          }
          
        });
      });
    };

    const sendNotification = (homeKey, detectionType, deviceLocation, deviceName) => {
      const message = detectionType === 'motion'
          ? `Motion detected at ${homeKey}. Location: ${deviceLocation}. Name: ${deviceName}`
          : `Sound detected at ${homeKey}. Location: ${deviceLocation}. Name: ${deviceName}`;

      PushNotification.localNotification({
        channelId: "theftguard1234",
        title: "Alert",
        message: message,
        playSound: true,
        soundName: 'default',
        autoCancel: false
      });
    };

    const handleNotificationAction = async (homeKey, action) => {
        const notificationsRef = firebase().ref('Notifications');
        try {
            await notificationsRef.push({
                homeKey,
                action,
                uid: user ? user.uid : 'null',
                user: user ? user.displayName : 'Anonymous',
                timestamp: new Date().toISOString(),
            });
            setNotification(null); // Clear notification from state
        } catch (error) {
            console.error("Error pushing notification:", error);
        }
    
        // Schedule the 'missed' action after 30 minutes
        setTimeout(async () => {
            try {
                const missedNotification = await notificationsRef.push({
                    homeKey,
                    action: 'missed',
                    user: user ? user.displayName : 'Anonymous',
                    timestamp: new Date().toISOString(),
                });
                console.log('Missed notification scheduled:', missedNotification.key);
            } catch (error) {
                console.error("Error pushing missed notification:", error);
            }
        }, 1800000); // 30 minutes in milliseconds
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.textColor}>
                Welcome! {user ? user.displayName : 'Guest'}
            </Text>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>System Status</Text>
                <Switch
                    style={`${styles.togglebutton}`}
                    value={systemStatus}
                    onValueChange={handleToggle}
                />
            </View>
            {notification && (
                <View style={styles.notificationContainer}>
                    <Text style={styles.notificationTitle}>Notification Received:</Text>
                    <Text style={styles.notificationMessage}>{notification.title || 'No title'}</Text>
                    <Text style={styles.notificationMessage}>{notification.message || 'No message'}</Text>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.btnCancel} onPress={() => handleNotificationAction(notification.homeKey, 'dismissed')}>
                            <Text style={styles.btnColor}>Dismiss</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnOk} onPress={() => handleNotificationAction(notification.homeKey, 'accepted')}>
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
    },
    textColor: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    toggleLabel: {
        fontSize: 24,
        marginRight: 10,
        color: '#000',
        fontWeight: 'bold'
    },
    togglebutton:{
        width: 80
    },
    notificationContainer: {
        width: 300,
        height: 'auto',
        marginTop: '30%',
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        color: '#000',
        alignSelf: 'center',
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#000',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    btnCancel: {
        width: 90,
        height: 50,
        backgroundColor: 'red',
        color: "#fff",
        marginLeft: 15,
        padding: 10,
        borderRadius: 2,
        textAlign: 'center',
        borderRadius: 5,
    },
    btnOk: {
        width: 80,
        height: 50,
        textAlign: 'center',
        backgroundColor: 'green',
        marginLeft: 15,
        color: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    btnColor: {
        color: '#FFF',
    },
});

export default HomeScreen;