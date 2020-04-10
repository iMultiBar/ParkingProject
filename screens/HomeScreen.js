import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { createStackNavigator } from 'react-navigation-stack';
import MapScreen from './MapScreen';
import ReservationScreen from './Reservation';
import { createAppContainer } from 'react-navigation';

const AppNavigator = createStackNavigator({
    Map: { screen: MapScreen }, Reservation: { screen: ReservationScreen }
});

const AppContainer = createAppContainer(AppNavigator)

function HomeScreen() {
    return (
        <AppContainer />
    )
}

HomeScreen.navigationOptions = {
    tabBarLabel: "Home",
    tabBarIcon: () => (
        <AntDesign name="home" size={30} color="blue" />
    )
    ,
    activeColor: "red",
    inactiveColor: "black",
    barStyle: { backgroundColor: "#FFF575" }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;

