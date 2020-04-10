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
import LinksScreen from '../screens/LinksScreen';
import UserScreen from '../screens/UserScreen';
import TestScreen from '../screens/TestScreen';
import CleanerScreen from '../screens/CleanerScreen'; // import the cleanerScreen.js to use it in the StackNavigator
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';
import carriersScreen from '../screens/carriersScreen';
import RewardsScreen from '../screens/RewardsScreen.js';




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
    Home: HomeScreen,
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
const ReportStack = createStackNavigator(
  {
    Report: ReportScreen,
  },
  config
);

ReportStack.navigationOptions = {
  tabBarLabel: 'Report',
  tabBarIcon: ({ focused }) => (
    <MaterialIcons focused={focused} name={'report'} />
  ),
};

ReportStack.path = '';
//////////////////////////////////////////////////////////
/*
  This is the SuggestionsStack object. It handles the bottom navigation for the SuggestionsScreen
  below there is also the navigationOptions for the SuggestionsStack, and inside of that is the title
  and icon of the Bottom Tab. the stack navigator is then added to the tabNavigator object.
*/
const SuggestionsStack = createStackNavigator(
  {
    Suggestions: SuggestionsScreen,
  },
  config
);

SuggestionsStack.navigationOptions = {
  tabBarLabel: 'Suggestions',
  tabBarIcon: ({ focused }) => (
    <FontAwesome focused={focused} name={'question'} />
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
/*
  This is the NewsStack object. It handles the bottom navigation for the NewsScreen
  below there is also the navigationOptions for the NewsStack, and inside of that is the title
  and icon of the Bottom Tab. the stack navigator is then added to the tabNavigator object.
*/
const NewsStack = createStackNavigator(
  {
    News: NewsScreen,
  },
  config
);

NewsStack.navigationOptions = {
  tabBarLabel: 'News',
  tabBarIcon: ({ focused }) => (
    <Entypo focused={focused} name={'news'} />
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
// this const creates stack navigator which uses the import apove to display when the user click on it.
const CleanerStack = createStackNavigator(
  {
    Cleaner: CleanerScreen,
  },
  config
);
// this naigationoptions allows to edit the tab it self for here. i added a tabBarLable which give a name to the tab
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
////////////////////////////////////////////////////////////////
const CarriersStack = createStackNavigator(
  {
    Carriers: carriersScreen,
  },
  config
);

CarriersStack.navigationOptions = {
  tabBarLabel: 'CarriersScreen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

CarriersStack.path = '';
//////////////////////////////////////////////////////////////////////

const RewardsStack = createStackNavigator(
  {
    Reward: RewardsScreen,
  },
  config
);

RewardsStack.navigationOptions = {
  tabBarLabel: 'Rewards',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

RewardsStack.path = '';

// here the const get all the const names apove and put the them in tabnaigator to show them in the bottom on the screen because we used (createBottomTabNavigator)
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  TestStack,
  SettingsStack,
  UserScreenStack,
  LinksStack,
  NewsStack,
  SuggestionsStack,
  CleanerStack,
  CarriersStack,
  ReportStack,
  RewardsStack
});

// work in progress...

// if(firebase.auth().currentUser === null){
//  console.log("still did not log in")
// }else{..
  
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
