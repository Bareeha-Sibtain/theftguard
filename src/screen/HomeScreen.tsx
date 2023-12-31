//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const HomeScreen:React.FC =  () => {
    return (
        <View style={styles.container}>
            <Text style={styles.notify}>HomeScreen</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    notify: {
        backgroundColor: '#fff',
        color: "#000",
        padding: "20%", 
    },
});

//make this component available to the app
export default HomeScreen;
