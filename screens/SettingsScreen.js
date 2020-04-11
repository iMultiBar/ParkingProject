import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TextInput, Button, Picker } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import db from "../db";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

export default function SettingsScreen() {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [uri, setUri] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [subscription, setSubscription] = useState("")
  const [flag, setFlag] = useState(false);
  const [userSub, setUserSub] = useState([])

  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  useEffect(() => {
    askPermission();
  }, []);

  const handleSet = async() => {
    const user = firebase.auth().currentUser;
    setDisplayName(user.displayName);
    setPhotoURL(user.photoURL);

    let check = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
    if(check.data()){
      setFlag(true)
      setUserSub(check.data())
    }
  };

  useEffect(() => {
    handleSet();
  }, []);



  const handleSave = async () => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const putResult = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .put(blob);
    const url = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .getDownloadURL();
    const updateUser = firebase.functions().httpsCallable("updateUser");
    const response2 = await updateUser({
      uid: firebase.auth().currentUser.uid,
      displayName,
      photoURL: url
    });
    console.log("updateUser response", response2);
    console.log("new displayName", firebase.auth().currentUser.displayName);
    setPhotoURL(url);
  };
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handlePickImage = async () => {
    // show camera roll, allow user to select
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };


  const handleSubscription = () => {
    if(subscription === "bronze"){
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "bronze",
        carWashPoints: 1,
        valetPoints: 2,
      })
    }else if(subscription === "silver"){
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "silver",
        carWashPoints: 2,
        valetPoints: 4,
      })
    }else if(subscription === "gold"){
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "gold",
        carWashPoints: 3,
        valetPoints: 6,
      })
    }
    
  };
  

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          fontSize: 24
        }}
        onChangeText={setDisplayName}
        placeholder="Display Name"
        value={displayName}
      />
      {photoURL !== "" && (
        <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
      )}
      <Button title="Pick Image" onPress={handlePickImage} />
      <Button title="Save" onPress={handleSave} />
      <View>
      {flag == false ? <View>
        <Text>
        Subscription 
        </Text>
        <View>
        <Picker
          selectedValue={"Pick a Department"}
          style={{height: 50, width: "100%"}}
          onValueChange={(itemValue, itemIndex) =>
            setSubscription(itemValue)
          }>
          <Picker.Item label="Select a Department" value="" />
          <Picker.Item label="Bronze Price:15" value="bronze" />
          <Picker.Item label="Silver Price:30" value="silver" />
          <Picker.Item label="Gold Price:50" value="gold" />
        </Picker>
        </View>
        <Button title="subscribe and pay" onPress={handleSubscription}/>
        </View>
        : <View>
          <Text>Car Wash Point: {userSub.carWashPoints}</Text>
          <Text>Type: {userSub.type}</Text>
          <Text>Valet Point: {userSub.valetPoints}</Text>
          </View>
          }
      
      </View>
      <Button title="Logout" onPress={handleLogout} />  
    </ScrollView>
  );
}

SettingsScreen.navigationOptions = {
  title: "Settings"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 24,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
