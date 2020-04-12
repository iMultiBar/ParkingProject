import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons,Entypo,AntDesign,FontAwesome,MaterialIcons } from '@expo/vector-icons';


//check lines number 19, 130, 137, and 184.

import db from '../db';
import firebase from "firebase/app";
import "firebase/auth";

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import UserScreen from '../screens/UserScreen';
import RequestCleaner from '../screens/TestScreen';
import CleanerScreen from '../screens/CleanerScreen'; // import the cleanerScreen.js to use it in the StackNavigator
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';
import CarriersScreen from '../screens/carriersScreen';
import ValetScreen from '../screens/ValetScreen'
import ReservationScreen from '../screens/Reservation';
import MapScreen from '../screens/MapScreen';
import HistoryScreen from '../screens/HistoryScreen';




const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
/*
  This is the HomeStack object. It handles the bottom navigation for the HomeScreen
  below there is also the navigationOptions for the HomeStack, and inside of that is the title
  and icon of the Bottom Tab. the stack navigator is then added to the tabNavigator object.
  this whole component is where me and my group put all the bottom tab navigation links.
  so this file handles the navigation for the whole project.
*/
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen, News: { screen: NewsScreen} ,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <Entypo
      focused={focused}
      name={'map'}
    />
  ),
};

HomeStack.path = '';
////////////////////////////////////////////////////////////////////////

const UserScreenStack = createStackNavigator(
  {
    UserScreen: UserScreen, 
    Map: { screen: MapScreen }, 
    Settings: { screen: SettingsScreen  }, 
    Reservation: { screen: ReservationScreen }, 
    Suggestions: { screen:  SuggestionsScreen},
    Cleaner: { screen: CleanerScreen },
    Carriers: { screen: CarriersScreen },
    Valet: { screen: ValetScreen },
    RequestCleaner: {screen: RequestCleaner},
    History: {screen: HistoryScreen}
  },
  config
);

UserScreenStack.navigationOptions = {

  tabBarLabel: 'UserScreen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

UserScreenStack.path = '';
////////////////////////////////////////////////////////////////
const MapStack = createStackNavigator(
  {
    Map: { screen: MapScreen }, Reservation: { screen: ReservationScreen }
  },
  config
);

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <Entypo
      focused={focused}
      name={'map'}
    />
  ),
};

MapStack.path = '';
////////////////////////////////////////////////////////////////////////


// here the const get all the const names apove and put the them in tabnaigator to show them in the bottom on the screen because we used (createBottomTabNavigator)
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  MapStack,
  UserScreenStack
});



tabNavigator.path = '';

export default tabNavigator;
