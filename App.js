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
  Button,
  Picker,
  ProgressViewIOS,
  Text
} from "react-native";
import ReactNativePickerModule from "react-native-picker-module"
import { Ionicons } from "@expo/vector-icons";

// import {
//   Select,
//   Option,
// } from 'react-native-option-select';
 

import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function App(props) {
 let pickerRef = null;
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("register");
  console.disableYellowBox = true;
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [displayName, setDisplayName] = useState("");


  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

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

  const handleLogin = async () => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    updateUserLogin();
  };

  const handleView = async () => {
    if (view === "login") {
      setView( "register" )
    }
    else {
      console.log("sup")
      setView("login" )
    }
  };

  const updateUserLogin = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        displayName,
        email,
        phone,
        department,
        role:"student"
      });
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!user && view === "login") {
    return (
      <View style={styles.contentContainer}>
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
    
        <Button title="submit" onPress={handleLogin} />
        <Button title="go to register" onPress={handleView} />
      </View>
    );
  }

  else if (!user && view === "register") {
    return (
      <View style={styles.contentContainer}>
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
          style={{ height: 40, borderColor: "gray", borderWidth: 1,marginBottom:10 }}
          onChangeText={setPhone}
          placeholder="mobile number"
          value={phone}
        />
        {Platform.OS === "ios"? 
          <>
          <TouchableOpacity
          onPress={() => {pickerRef.show()}}
        >
    <Text>{department === ""? "select a Department": department}</Text>
        </TouchableOpacity>
        <ReactNativePickerModule
          pickerRef={e => (pickerRef = e)}
          selectedValue={department}
          title={'Select a department'}
          items={['IT','business','engineering','health and science','faculty']}
           style={{height: 50, width: "100%",}}
          onCancel={() => {console.log("cancelled")}}
          onValueChange={(itemValue, itemIndex) =>
            setDepartment(itemValue)
          } 
          />
          </>
        : 
        <Picker
        selectedValue={department}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue, itemIndex) => setDepartment(itemValue)}
      >
        <Picker.Item label="IT" value="IT" />
        <Picker.Item label="business" value="business" />
        <Picker.Item label="health and science" value="health and science" />
        <Picker.Item label="faculty" value="faculty" />
      </Picker>
        }
        
        
        <Button title="submit" onPress={handleRegister} />
        <Button title="have and account? go to login" onPress={handleView} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {console.log(user,view)}
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

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

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

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
