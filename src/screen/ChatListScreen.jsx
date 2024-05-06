import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const currentUser = auth().currentUser;
 console.log(chats);
    


    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                const chatsRef = firebase().ref('chats');
                chatsRef.on('value', snapshot => {
                    const chatsArray = [];
                    snapshot.forEach(childSnapshot => {
                        const chat = childSnapshot.val();
                        if (chat.memberId1 === user.uid || chat.memberId2 === user.uid) {
                            chatsArray.push({
                                key: childSnapshot.key,
                                ...chat
                            });
                        }
                    });
                    setChats(chatsArray);
                });
    
                // Cleanup function to unsubscribe from changes on unmount
                return () => chatsRef.off('value');
            }
        });
    
        return () => unsubscribe(); // Cleanup auth state listener
    }, []);
    

    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.key })}>
                    <Text>{item.lastMessage}</Text>
                    <Text>{new Date(item.lastMessageTimestamp).toLocaleTimeString()}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
        />
    );
};

export default ChatListScreen;
