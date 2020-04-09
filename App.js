// bugfix for firebase 7.11.0
import { decode, encode } from 'base-64'
global.btoa = global.btoa || encode;
global.atob = global.atob || decode;

import { AppLoading } from "expo";

// This import statement "Asset" is used because expo-asset provides an interface to Expo's asset system. 
// An asset is any file that lives alongside the source code of our parking app that the app needs at runtime. 
// The Examples include images, fonts, and sounds. 
// The Expo's asset system integrates with React Native's so that we can refer to files with require ('path/to/file'). 
import { Asset } from "expo-asset";

import * as Font from "expo-font";

import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Picker,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

// Within this file, we are using three react native elements (Button, Text, SocialIcon). 
import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';


import * as Animatable from "react-native-animatable";

import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";


// Overall within this file App.js, we have implemented our login and register system for parking app. Each user is responsible for creating a new account and registering himself or herself 
// on the system. Once they have registered with the following details which our parking app is asking them, they shall login and can access our parking app features sequentially. 

export default function App(props) {

  // This useState is declared to complete the loading of the database from our parking firebase console. 
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // This useState is declared to set the user and their information into the database once they have successfully registered. 
  const [user, setUser] = useState(null);

  // This useState is declared to set the view of the register form when the user has successfully registered. 
  const [view, setView] = useState("register");

  // This five useStates are part of our register form. The user shall fill out all the five pieces of information on the register form in order to complete their registration
  // successfully. Once they have fully registered with an appropriate email, password, phone, department, and displayName, they are taken to the Login form page to login successfully into
  // our parking app. 

  // All of these five useStates' data types are declared as string. We are allowing users or customers to register with plain text into our parking app system. 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [displayName, setDisplayName] = useState("");


  // A useEffect which returns the firebase authentication while setting up the user. The main logic behind this useEffect is to verify whether the user 
  //who has registered is fully authenticated within the firebase console authentication or not. Furthermore, this useEffect runs after every render and manages the authentication
  // of the users in firebase. 
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);


  // This function is defined to deal with the registration of the user. 
  // It allows a user to register successfully with an email and password. 
  // Once they have registered successfully, the new registered account shall be added into the firebase under Authentication (Project Settings > Users) in our firebase console. 
  // Furthermore, it is updated and set in the users collection also. 

  const handleRegister = async () => {
    // We are using await function and combining it with "createUserWithEmailAndPassword(email, password)" because
    // this is an asynchronous function which returns an AsyncFunction object. It is operating and generating a new user account via
    // the event loop using an implicit Promise to return its result. 
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    // Within this statement, we have combined await with "firebase.auth().currentUser.uid" because 
    // this is an asynchronous function which returns an AsyncFunction object. It is operating and fetching the information of the user 
    // from our firebase authentication database if it already exists of not.
    // Once this if finalized, then the information of the user shall be updated based on the current authentication criteria within the system. 
    const response = await fetch(
      `https://us-central1-parkingcp3445.cloudfunctions.net/initUser?uid=${
      firebase.auth().currentUser.uid
      }`
    );
    updateUserLogin();
    console.log("register time")
  };

  // This method deals with the login system of the user. If the user has successfully registered and their information has been stored into the firebase "Users" information, 
  // they can login with their email and password credentials and login into our parking app system. 
  // Once they have successfully logged in, their information is updated and set in the users collection. 
  const handleLogin = async () => {

    // We are using await function and combining it with "signInWithEmailAndPassword(email, password)" because
    // this is an asynchronous function which returns an AsyncFunction object. It is operating and generating a login system via
    // the event loop using an implicit Promise to return its result. 

    // With the help of this statement, the user is able to login into our parking app successfully if their registered credentials are right. 
    await firebase.auth().signInWithEmailAndPassword(email, password);


    updateUserLogin();
  };

  // This method is responsible for handling the view of the register and login pages. The main focus is that the user cannot see the view of the Login form until have registered successfully. 
  // Furthermore, if the user has already registered they can navigate to the Login form by clicking on one of the navigation buttons which will be discussed later in this file and change the view 
  // of the screen. 

  // This is an asynchronous function as it is generating and operating the view through via the event loop and returning the result of the view screen. 

  // According to these conditions, if the view is login then it will be reversed and set to register. 
  // On the other hand, if the view is register then it will be reversed and set to login. 
  const handleView = async () => {
    if (view === "login") {
      setView("register")
    }
    else {
      console.log("sup")
      setView("login")
    }
  };

  // This method is called within the handleRegister and handleLogin method. The purpose of this method is to update the user details and set them in the users collection if their 
  // account already exists. If they are registering and logging in for the first time, a new record shall be created in the firebase console authentication and 
  // the new information as a record shall be set in the users collections. Otherwise if this is a returning user then 
  // their previous record credentials shall be updated into the users collection. 
  const updateUserLogin = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        displayName,
        email,
        phone,
        department,
        role: "student"
      });
  };

  // This is where our main return statement begins based on our conditions and shall display the results on our main parking app screen: 
  // Condition 1- If the system is taking a long time to fetch + complete the loadings from the firebase console database then they shall recieve error messages. 
  // The handleLoadingError method is being called to catch and handle any error while the loading procedure runs. 
  // The handleFinishLoading method is being called to set the completing of the loading method to true which indicates that the loading has been finished. 
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }

  // Condition 2- Else if the loading is running successfully and the user has already registered, then they shall view the Login form. 
  // They can enter their login credentials and enter our parking app. 

  // According to our condition !user && view === "login", we are checking that if that particular user exists and view is referring to login screen, 
  // then they shall be able to view the Login Form only. 
  // They shall enter their registered email and password credentials and login into our parking app successfully if they have entered the correct credentials. 
  else if (!user && view === "login") {
    return (
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", marginLeft: 50 }}>
          <View>
            <SocialIcon   
              type='foursquare'
            />
          </View>


          <View>
            <Text style={{ fontSize: 30, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>LOGIN FORM</Text>
          </View>
        </View>


        {/* According to our decision, we have decided to have two TextInputs in our Login Form (Email, Password) as we require users to enter only their 
        registered email and password into the system and login successfully on our parking app. */}
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setEmail}
          placeholder="Email"
          value={email}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
        />

        <View style={{ marginTop: 10 }}></View>

        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">

          {/* We have declared this button because this is used to call the function handleLogin, submit the entered credentials and 
          allow the user to login into our parking app.    */}
          <Button
            icon={
              <AntDesign
                name="rightcircle"
                color="white"
                size={15}
              />
            }
            title=" SUBMIT"
            onPress={handleLogin}
          />
        </Animatable.View>


        <View style={{ marginTop: 10 }}></View>

        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">

          {/* We have declared this button because this is used to call the function handleView, change the view of the screen to Register Form 
           and allow the user to register first before they login into our parking app.    */}
          <Button
            icon={
              <AntDesign
                name="rightcircle"
                color="white"
                size={15}
              />
            }
            title=" GO TO REGISTER"
            onPress={handleView}
          />
        </Animatable.View>


      </View>
    );
  }

  // Condition 3- Else if the user is new to our parking app and wants to register, he shall be redirected to our register form. 
  // According to our condition which we have declared !user && view === "register", we are checking that if the user exists which means he is not null and the view 
  // page is register form, then the user shall be redirected to the register form to register successfully with their new credentials. 

  // The main idea and logic behind this view and checking that someone has accessed our parking app and wants to explore it. The main and first step of our parking app is to 
  // create an account and login with it. Once registration and login is successful then they shall be able to explore our parking app features. 

  else if (!user && view === "register") {
    return (
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", marginLeft: 30 }}>
          <View>
            <SocialIcon
              type='foursquare'
            />
          </View>

          <View>
            <Text style={{ fontSize: 30, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>REGISTER FORM</Text>
          </View>
        </View>


        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setDisplayName}
          placeholder="Display Name"
          value={displayName}
        />
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setEmail}
          placeholder="Email"
          value={email}
        />

        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
        />

        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setPhone}
          placeholder="mobile number"
          secureTextEntry={true}
          value={phone}
        />

        <Picker
          selectedValue={"Pick a Department"}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue, itemIndex) =>
            setDepartment(itemValue)
          }>
          <Picker.Item label="Select a Department" value="" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="business" value="business" />
          <Picker.Item label="engineering" value="engineering" />
          <Picker.Item label="health and science" value="health and science" />
          <Picker.Item label="faculty" value="faculty" />
        </Picker>

        <View style={{ marginTop: 10 }}></View>

        <Animatable.View animation="jello" iterationCount="infinite" direction="alternate">

          <Button
            icon={
              <AntDesign
                name="rightcircle"
                color="white"
                size={15}
              />
            }
            title=" SUBMIT"
            onPress={handleRegister}
          />
        </Animatable.View>


        <View style={{ marginTop: 10 }}></View>

        <Animatable.View animation="jello" iterationCount="infinite" direction="alternate">
          <Button
            icon={
              <AntDesign
                name="rightcircle"
                color="white"
                size={15}
              />
            }
            title=" HAVE AN ACCOUNT? GO TO LOGIN"
            onPress={handleView}
          />
        </Animatable.View>



      </View>
    );
  } 
  
  
  // Condition 4- If none of the conditions above are met, then he shall be viewing only our default AppNavigator system. 
  // According to this condition and return statement, we are rendering an App Navigator which is settles across our iOS 
  or android platform for our parking app. 
  else {
    return (
      <View style={styles.container}>
        {console.log(user, view)}
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

// This function is responsible for loading the resources through synchronization process from the system. 
//This system is part of our expo and firebase console mechanisms.
async function loadResourcesAsync() {
  
  // We have declared an await function as this is acting as an asynchronous function and loading required images as resources into our system. 
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

// This function is responsible for handling any erros which occurs during any stage in the system. Once of the most common use of this 
// method is dealing with the errors within the loading system when the system takes time to load all the components and then this method works by catching and representing the errors. 
function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

// This method is responsible for handling the loadings of the system when they are finished. When the loading has been completed successfully, the method sets the loading 
// boolean useState to true. 
function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}


// These are the styles which we are applying through our stylesheet react native component on this file. 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  }
});

