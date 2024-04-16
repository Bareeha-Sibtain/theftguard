//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';


// create a component
const HomeScreen: React.FC = () => {
  
  return (
    <View style={styles.container}>  
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 24.860966,
          longitude: 66.990501,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }}
      />
    </View>
  );


  
};

// define your styles
const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });

//make this component available to the app
export default HomeScreen;
