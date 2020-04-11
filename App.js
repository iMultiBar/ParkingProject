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
  KeyboardAvoidingView,Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';

// import {
//   Select,
//   Option,
// } from 'react-native-option-select';
 


console.disableYellowBox = true;
import AppNavigator from "./navigation/AppNavigator";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db";


import { Input,Card,Button  } from "react-native-elements"
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");

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
    console.log(email,password)
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
      <KeyboardAvoidingView behavior="height" style={styles.contentContainer}>
      <View style={{justifyContent:"center",flex:1}}>


      <Card
        image={require('./assets/images/frontpage.jpg')}>
        <View style={{marginBottom: 10}}>
        <Text>Your Email Address</Text>
        <Input
          placeholder='email@address.com'
          onChangeText={(text) => setEmail(text)}
          value={email}
          inputStyle={{paddingLeft:10}}
          leftIcon={<Icon
            name='user'
            color='lightgray'
            size={20}
          />}
        />
        <Text>Password</Text>
        <Input
          placeholder='password'
          secureTextEntry={true}
          textContentType="password"
          onChangeText={(text) => setPassword(text)}
          inputStyle={{paddingLeft:10}}
          leftIcon={
            <Icon
              type="FontAwesome"
              name='lock'
              color='lightgray'
              size={20}
            />
          }
          value={password}
        />
        </View>
        <Button
          
          icon={<Icon name='code' color='#ffffff' />}
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title="Login" onPress={handleLogin} type="outline" />


          <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
            <Text>Don't Have an account ? </Text> 
            <TouchableOpacity onPress={handleView}>
              <Text style={{color:"purple"}}> Register </Text>
            </TouchableOpacity>
          </View>
                
      </Card>
        </View>
              
      </KeyboardAvoidingView>
      
    );
  }

  else if (!user && view === "register") {
    return (
      <KeyboardAvoidingView behavior="height" style={styles.contentContainer}>
<View style={{justifyContent:"center",flex:1}}>


<Card
  image={require('./assets/images/registerpage.jpg')}>
  <View style={{marginBottom: 10}}>
  <Text>Display Name</Text>
  <Input
    placeholder='Ahmad, Etc'
    onChangeText={(text) => setDisplayName(text)}
    inputStyle={{paddingLeft:10}}
    leftIcon={
      <Icon
        type="AntDesign"
        name='user'
        color='lightgray'
        size={20}
      />
    }
    value={displayName}
  />
  <Text>Your Email Address</Text>
  <Input
    placeholder='email@address.com'
    onChangeText={(text) => setEmail(text)}
    value={email}
    inputStyle={{paddingLeft:10}}
    leftIcon={
      <Icon
        type="AntDesign"
        name='cloud'
        color='lightgray'
        size={20}
      />
  }
  />
    <Text>Password</Text>
    <Input
    placeholder='password'
    type="password"
    secureTextEntry={true}
    onChangeText={(text) => setPassword(text)}
    inputStyle={{paddingLeft:10}}
    leftIcon={
      <Icon
        type="FontAwesome"
        name='lock'
        color='lightgray'
        size={20}
      />
    }
    value={password}
  />
    <Text>Phone</Text>
    <Input
    placeholder='phone'
    onChangeText={(text) => setPhone(text)}
    inputStyle={{paddingLeft:10}}
    keyboardType={'numeric'}
    leftIcon={
      <Icon
        type="AntDesign"
        name='phone'
        color='lightgray'
        size={20}
      />
    }
    value={phone}
  />
  <Text>Department</Text>
<Picker
          selectedValue={department}
          style={{height: 50, width: "100%"}}
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

  </View>
  <Button
    
    icon={<Icon name='code' color='#ffffff' />}
    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
    title="Register" onPress={handleLogin} type="outline" />


    <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
      <Text>Already Own an account ? </Text> 
      <TouchableOpacity onPress={handleView}>
        <Text style={{color:"purple"}}> Login </Text>
      </TouchableOpacity>
    </View>
          
</Card>
  </View>





      {/* <View style={{justifyContent:"center",flex:1}}>
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
          selectedValue={department}
          style={{height: 50, width: "100%"}}
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


        <Button title="submit" onPress={handleRegister} />
        <Button title="have and account? go to login" onPress={handleView} />
      </View> */}
      </KeyboardAvoidingView>
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
    paddingTop: 30,
    flex:1
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  }
});
