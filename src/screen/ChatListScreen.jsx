// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const ChatListScreen = ({ navigation }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const currentUserId = auth().currentUser?.uid;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersCollection = await firestore().collection('users').get();
//         const userList = [];
//         usersCollection.forEach(doc => {
//           const user = doc.data();
//           if (doc.id !== currentUserId) {  // Exclude the current user
//             userList.push({
//               key: doc.id,
//               userId: doc.id,
//               ...user
//             });
//           }
//         });
//         setUsers(userList); // Set users once after processing all documents
//         console.log('Fetched users:', userList); // Adjusted log statement
//       } catch (error) {
//         console.error("Error fetching users: ", error);
//       } finally {
//         setLoading(false); // Set loading to false once data is fetched
//       }
//     };

//     fetchUsers();
//   }, [currentUserId]);

//   const startChat = (userId, userName) => {
//     const chatId = currentUserId > userId ? `${currentUserId}_${userId}` : `${userId}_${currentUserId}`;
//     const chatRef = firestore().collection('chats').doc(chatId);

//     chatRef.get().then(doc => {
//       if (!doc.exists) {
//         chatRef.set({
//           participants: {
//             [currentUserId]: true,
//             [userId]: true
//           },
//           messages: []
//         });
//         firestore().collection('users').doc(currentUserId).collection('chats').doc(chatId).set({
//           userName: userName
//         });
//         firestore().collection('users').doc(userId).collection('chats').doc(chatId).set({
//           userName: auth().currentUser.displayName
//         });
//       }
//     });

//     navigation.navigate('Chat', { chatId, userName });
//   };

//   // const renderUserItem = ({ item }) => {
//   //   console.log(item);
//   //   return (
//   //     <TouchableOpacity onPress={() => startChat(item.userId, item.userName)} style={styles.userItem}>
//   //       <Text style={styles.userName}>{item.userName}</Text>
//   //     </TouchableOpacity>
//   //   );
//   // };

//   return(
//     <View style={styles.container}>
//       {
//         loading ? (
//           <ActivityIndicator size="large" color="#000" />
//         ) : (
//           <FlatList
//           data={users}
//           renderItem={({item}) => (
//             <View>
//                <TouchableOpacity onPress={() => startChat(item.userId, item.userName)} style={styles.userItem}>
//         <Text style={styles.userName}>{item.userName}</Text>
//       </TouchableOpacity>
//             </View>
//           )}
//           keyExtractor={item => item.key}
//           />
//         )
//       }
//     </View>
//   )

  
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 10,
//     color: '#000 '
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#000'
//   },
//   userItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//     color: '#000'
//   },
//   userName: {
//     fontSize: 18,
//     color: '#000',
//   },
// });

// export default ChatListScreen;
