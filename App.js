// bugfix for firebase 7.11.0
import { decode, encode } from 'base-64'
global.btoa = global.btoa || encode;
global.atob = global.atob || decode;
import { AppLoading } from "expo";
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

// The three react native elements which I have used = Button, Text, SocialIcon. 
import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';

import * as Animatable from "react-native-animatable";


// import {
//   Select,
//   Option,
// } from 'react-native-option-select';


import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";

// Within this file App.js, we have implemented our login and register system for parking app. Each user is responsible for creating a new account and registering himself or herself 
// on the system. Once they have registered with the following details which our parking app is asking them, they shall login and can access our parking app features sequentially. 

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);  // This useState is declared to complete the loading of the database from our parking firebase console. 
  const [user, setUser] = useState(null); // This useState is declared to set the user and their information into the database once they have successfully registered. 
  const [view, setView] = useState("register"); // This useState is declared to set the view of the register form when the user has successfully registered. 


  // This five useStates are part of our register form. The user shall fill out all the five pieces of information on the register form in order to complete their registration
  // successfully. Once they have fully registered with an appropriate email, password, phone, department, and displayName, they are taken to the Login form page to login successfully into
  // our parking app. 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [displayName, setDisplayName] = useState("");


  // A useEffect which returns the firebase authentication while setting up the user. This verifies whether the user who has registered is fully authenticated 
  // within the firebase console authentication or not. 
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  // This method deals with the registration of the user. It allows a user to register successfully with an email and password. Once they have registered successfully, the new
  // registered account shall be added into the firebase under Authentication (Project Settings > Users). 
  const handleRegister = async () => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);

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
  const handleLogin = async () => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    updateUserLogin();
  };

  // This methods is responsible for handling the view of the register and login pages. The main focus is that the user cannot see the view of the Login form until have registered successfully. 
  // Furthermore, if the user has already registered they can navigate to the Login form by clicking on one of the navigation buttons which will be discussed later in this file and change the view 
  // of the screen. 
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
  // account already exists. If they are registering and logging in for the first time, a new record shall be set in the users collections. Otherwise if this is a returning user then 
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

  // This is where our main return statement begins based on our conditions: 
  // 1- If the system is taking a long time to fetch + complete the loadings from the firebase console database then they shall recieve error messages. 
  // 2- Else if the loading is running successfully and the user has already registered, then they shall view the Login form. They can enter their login credentials and enter our parking app. 
  // 3- Else if the user is new to our parking app and wants to register, he shall be redirected to our register form. 
  // 4- If none of the conditions above are met, then he shall be viewing only our default AppNavigator system. 
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }

  else if (!user && view === "login") {
    return (
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", marginLeft: 50 }}>
          <View>
            <SocialIcon   // This is my first react native element "SocialIcon" which I have used in this file of type foursquare. The purpose of using this react native element is to make our customers aware 
              // how we represent ourselve as an icon. Furthermore, we are considering this social icon as our brand symbol. This signifies our parking app with more symbolism and
              // creativity towards people globally. Also, it is acting as a visual cues to online and social media networks globally. 
              type='foursquare'
            />
          </View>


          <View>
            {/* This is my second react native element "Text" which I have used in this file. Text displays words and characters at various sizes. Furthemore, I would like to display 
              the text of our parking app in a creative and unique manner. This is the reason I have used it.  */}
            <Text style={{ fontSize: 30, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>LOGIN FORM</Text>
          </View>
        </View>


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

        {/* This is an animation of type "pulse" which I have applied on one of my buttons "SUBMIT". This animation works as a heartbeat of a human being. 
        I have applied the "interationCount" property which indicates the number of times that an animation cycle is played before the animation stops. 
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
          {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

          {/* This button also includes an icon which is of type "rightcircle". The icon belongs to the library "AntDesign" and this is of size 15 and color "white".  */}

          {/* React Navigation: This button "SUBMIT" is part of the react navigation system and login form. This button allows a user to submit their login credentials successfully and 
          make them navigate to the main HomeScreen of our parking app system. Once they have navigated into our parking app and they are able to see our HomeScreen, this indicates
          that they have entered the parking app successfully. */}

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

        {/* This is an animation of type "pulse" which I have applied on one of my buttons "GO TO REGISTER". This animation works as a heartbeat of a human being. 
        I have applied the "interationCount" property which indicates the number of times that an animation cycle is played before the animation stops. 
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
          {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

          {/* This button also includes an icon which is of type "rightcircle". The icon belongs to the library "AntDesign" and this is of size 15 and color "white".  */}


          {/* React Navigation: This button is part of the react navigation system and login form. If the user has not registered and is new to the system, then he can visit the register
          form by clicking on this button "GO TO REGISTER". This will navigate the user to the registration form page. The main purpose is that the user cannot view or implement
          any actions in our parking app until he is a registered member of it or has an account. So this is why he has another option from Login Form page to visit the register form 
          and register himself or herself into the system. */}

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

  else if (!user && view === "register") {
    return (
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", marginLeft: 30 }}>
          <View>
            {/* This is my first react native element "SocialIcon" which I have used in this file of type foursquare. The purpose of using this react native element is to make our customers aware 
          how we represent ourselve as an icon. Furthermore, we are considering this social icon as our brand symbol. This signifies our parking app with more symbolism and
          creativity towards people globally. Also, it is acting as a visual cues to online and social media networks globally.  */}
            <SocialIcon
              type='foursquare'
            />
          </View>

          <View>
            {/* This is my second react native element "Text" which I have used in this file. Text displays words and characters at various sizes. Furthemore, I would like to display 
              the text of our parking app in a creative and unique manner. This is the reason I have used it.  */}
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

        {/* This is an animation of type "jello" which I have applied on one of my buttons "SUBMIT". This type of animation works by shaking the element from right and left but 
        the element stays at the same place all the time due to alternate direction. 
        I have applied the "interationCount" property which indicates the number of times that an animation cycle is played before the animation stops. 
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

        <Animatable.View animation="jello" iterationCount="infinite" direction="alternate">
          
          {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

          {/* This button also includes an icon which is of type "rightcircle". The icon belongs to the library "AntDesign" and this is of size 15 and color "white".  */}

          {/* React Navigation: This button "SUBMIT" is part of the react navigation system and login form. This button allows a user to submit their login credentials successfully and 
          make them navigate to the main HomeScreen of our parking app system. Once they have navigated into our parking app and they are able to see our HomeScreen, this indicates
          that they have entered the parking app successfully. */}

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


        {/* This is an animation of type "jello" which I have applied on one of my buttons "HAVE AN ACCOUNT? GO TO LOGIN". This type of animation works by shaking the element from right and left but 
        the element stays at the same place all the time due to alternate direction. 
        I have applied the "interationCount" property which indicates the number of times that an animation cycle is played before the animation stops. 
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

        <Animatable.View animation="jello" iterationCount="infinite" direction="alternate">
          {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

          {/* This button also includes an icon which is of type "rightcircle". The icon belongs to the library "AntDesign" and this is of size 15 and color "white".  */}


          {/* React Navigation: This button is part of the react navigation system and register form. If the user has already registered successfully, he has an 100% chance
          to login successfully and view our parking app features. To navigate to the Login form directly he clicks on the button "HAVE AN ACCOUNT? GO TO LOGIN" which take 
          the user directly to the Login form. */}
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
  } else {
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

