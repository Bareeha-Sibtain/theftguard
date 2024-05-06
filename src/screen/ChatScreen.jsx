import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const timestamp = database.ServerValue.TIMESTAMP;

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Listen for updates to the messages node
    useEffect(() => {
        const messagesRef = firebase().ref('messages');
        const onReceiveMessage = messagesRef.on('value', snapshot => {
            const receivedMessages = [];
            snapshot.forEach(childSnapshot => {
                receivedMessages.push({
                    key: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            setMessages(receivedMessages);
        });

        return () => messagesRef.off('value', onReceiveMessage);
    }, []);

    const sendMessage = () => {
      if (message.length > 0) {
          const messagesRef = database().ref('messages');
          messagesRef.push({
              text: message,
              timestamp: database.ServerValue.TIMESTAMP, 
              userId: auth().currentUser.uid,
          });
          setMessage('');
      }
  };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Text style={styles.message}>{item.text}</Text>
                )}
                keyExtractor={item => item.key}
            />
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
            />
            <Button
                title="Send"
                onPress={sendMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        color: '#000'
    },
    message: {
        fontSize: 18,
        marginVertical: 4,
        color: "#000"
    }
});

export default ChatScreen;
