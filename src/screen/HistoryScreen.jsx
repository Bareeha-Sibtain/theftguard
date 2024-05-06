import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firebase from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const currentUser = auth().currentUser; // Get the currently logged-in user

    useEffect(() => {
        if (currentUser) {
            // Reference to the notifications node in your Firebase Realtime Database
            const notificationsRef = firebase().ref('Notifications');

            // Listen for updates in the notifications node
            const onValueChange = notificationsRef.on('value', snapshot => {
                const data = snapshot.val();
                const notificationsList = data ? Object.keys(data).map(key => ({
                    ...data[key],
                    key: key
                })).filter(notification => notification.user === currentUser.displayName) : []; // Filter notifications for the current user by name
                setNotifications(notificationsList);
            });

            // Unsubscribe from the realtime updates when the component unmounts
            return () => notificationsRef.off('value', onValueChange);
        }
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text style={styles.title}>Action: {item.action}</Text>
                        <Text style={styles.title}>Home Key: {item.homeKey}</Text>
                        <Text style={styles.title}>Timestamp: {item.timestamp}</Text>
                        <Text style={styles.title}>User: {item.user}</Text>
                    </View>
                )}
                keyExtractor={item => item.key}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        width: '100%'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    }
});

export default NotificationsScreen;
