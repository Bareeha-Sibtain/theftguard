import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = database().ref('messages');
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

    const sendMessage = async () => {
      console.log('hello from send message'); // Debug log
      if (message.length > 0) {
          try {
              const messagesRef = database().ref('messages');
              const userId = auth().currentUser?.uid;
              const userName = auth().currentUser?.displayName || "Anonymous";
  
              if (!userId) {
                  console.error("User is not authenticated");
                  return;
              }
  
              const newMessageRef = await messagesRef.push({
                  text: message,
                  timestamp: database.ServerValue.TIMESTAMP,
                  userId: userId,
                  userName: userName,
              });
  
              console.log("Message sent:", newMessageRef); // Debug log
              setMessage(''); // Clear the input field after sending the message
          } catch (error) {
              console.error("Error sending message:", error);
          }
      } else {
          console.warn("Message is empty");
      }
  };
  

    const renderItem = ({ item }) => {
        const isCurrentUser = item.userId === auth().currentUser?.uid;
        const messageStyle = isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage;
        const containerStyle = isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer;

        return (
            <View style={containerStyle}>
                <Text style={styles.userName}>{item.userName}</Text>
                <View style={messageStyle}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.key}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    placeholderTextColor="#000" 
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#000',
    },
    sendButton: {
        color: '#000',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 10,
    },
    sendButtonText: {
        color: '#000',
        fontSize: 16,
    },
    currentUserContainer: {
        alignItems: 'flex-end',
        marginVertical: 4,
    },
    otherUserContainer: {
        alignItems: 'flex-start',
        marginVertical: 4,
    },
    currentUserMessage: {
        backgroundColor: '#dcf8c6',
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        color: '#000'
    },
    otherUserMessage: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    timestamp: {
        fontSize: 10,
        color: '#555',
        textAlign: 'right',
    },
    userName: {
        fontSize: 12,
        color: '#000',
        marginBottom: 4,
    },
});

export default ChatScreen;