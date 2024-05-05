import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (currentUser) {
            const chatsRef = firebase().ref('chats').orderByChild('members/' + currentUser.uid).equalTo(true);
            chatsRef.on('value', snapshot => {
                const chatsArray = [];
                snapshot.forEach(childSnapshot => {
                    chatsArray.push({
                        key: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                setChats(chatsArray);
            });

            return () => chatsRef.off('value');
        }
    }, [currentUser]);

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
