import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import db from '../db';
import firebase from "firebase/app";
import "firebase/auth";

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import UserScreen from '../screens/UserScreen';
import TestScreen from '../screens/TestScreen';
import CleanerScreen from '../screens/CleanerScreen';
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';




const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';
//////////////////////////////////////////////////////////
const SuggestionsStack = createStackNavigator(
  {
    Suggestions: SuggestionsScreen,
  },
  config
);

SuggestionsStack.navigationOptions = {
  tabBarLabel: 'Suggestions',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

SuggestionsStack.path = '';
////////////////////////////////////////////////////////////////
const TestStack = createStackNavigator(
  {
    Test: TestScreen,
  },
  config
);

TestStack.navigationOptions = {
  tabBarLabel: 'Test',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

TestStack.path = '';
////////////////////////////////////////////////////////////////
const NewsStack = createStackNavigator(
  {
    News: NewsScreen,
  },
  config
);

NewsStack.navigationOptions = {
  tabBarLabel: 'News',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

NewsStack.path = '';
//////////////////////////////////////////////////////////////
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};
////////////////////////////////////////////////////////////////
const CleanerStack = createStackNavigator(
  {
    Cleaner: CleanerScreen,
  },
  config
);

CleanerStack.navigationOptions = {
  tabBarLabel: 'CleanerScreen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

CleanerStack.path = '';
//////////////////////////////////////////////////////////////

SettingsStack.path = '';


const UserScreenStack = createStackNavigator(
  {
    UserScreen: UserScreen,
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

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  TestStack,
  SettingsStack,
  UserScreenStack,
  LinksStack,
  NewsStack,
  SuggestionsStack,
  CleanerStack
});

// work in progress...

// if(firebase.auth().currentUser === null){
//  console.log("still did not log in")
// }else{
  
//   let role;
//   console.log(firebase.auth().currentUser.uid)
//   db.collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(snapShot => {
//     role = snapShot.data().role;
    
//   }
//   )
//   console.log("sssss",role)
//   if(role === "student"){
//     tabNavigator = createBottomTabNavigator({
//       HomeStack,
//       SettingsStack,
//       UserScreenStack,
//       NewsStack
//     });
//   } else{
//     tabNavigator = createBottomTabNavigator({
//       HomeStack,
//       LinksStack,
//       TestStack,
//       SettingsStack,
//     });
//   }
// }


tabNavigator.path = '';

export default tabNavigator;
