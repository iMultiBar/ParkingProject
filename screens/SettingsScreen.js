import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TextInput, Picker } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import db from "../db";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

import { MaterialIcons, Entypo } from "@expo/vector-icons";

// Within this file, we are using three react native elements (Button, Text, SocialIcon). 
import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import * as Animatable from "react-native-animatable";


const SettingsScreen = props => {
  // This useState property set as boolean type is responsible for setting up a permission for Camera on our phone. 
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false);

  // This is a string useState property "displayName" which belongs to the user who has registered and logged into the system. 
  const [displayName, setDisplayName] = useState("");

  // This is a string useState property "uri" which is used to set the url of the photo which the user selects from his phone system to create his profile avatar. 
  const [uri, setUri] = useState("");

  // This is a string useState property "photoURL" where the url of the photo is set. 
  const [photoURL, setPhotoURL] = useState("");

  // This is a string useState property "subscripton" which is created when the user selects the information for their subscription. 
  const [subscription, setSubscription] = useState("");

  // A boolean useState property which is used for setting the flag of a component. 
  const [flag, setFlag] = useState(false);

  // A useState property in terms of an array to set all the user's subscriptions in the form of an array in the subscriptions collection. 
  const [userSub, setUserSub] = useState([]);


  // This method is responsible for asking permission on the phone when the user wants to access the photos from the gallery. Once the 
  // permission has been granted by the user to the system, the user can access the images in the gallery. 
  // We have used the await function as this is an asynchronous function which is generating and operating permissions to pick the image from our phone. 
  // Once the image has been picked with an appropriate permission, the useState property "setHasCameraRollPermission" shall be set to "granted" status. 
  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  // This useEffect method is responsible for rendering the askPermission method after evey render. 
  // This is because we want the user to have a choice to grant permissions after every change in the system. 
  useEffect(() => {
    askPermission();
  }, []);


  // This handleSet method is responsible for setting the displayName and the photoURL of the user into the users collections. Each time a user selects and changes their displayName
  // and photoURL, this method shall run on call to set the information to the new one in the users collections. 

  // Furthermore, if the user wants to take a subscription, the setting of their displayName and photoURL shall be done based on their selected subscription. 
  // The function statement "firbase.auth().currentUser" is used to find the current user and then using the "setDisplayName" and "setPhotoURL", we shall set the displayName and 
  // and photo of the user in the firebase console system. 
  const handleSet = async () => {
    const user = firebase.auth().currentUser;
    setDisplayName(user.displayName);
    setPhotoURL(user.photoURL);


    // In this await statement, we are asynchronously getting the information of the user's subscription from the subcollection "subscription", which is associated within 
    // each user collection. If our checking is successful and we found a subscription then it will be set to that particular user. 
    let check = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
    if (check.data()) {
      setFlag(true)
      setUserSub(check.data())
    }
  };


  // This useEffect method is responsible for running the handleSet method after every render happens. It sets and replaces the 
  // new information which has been updated by the user with the original one in the users collection. 
  useEffect(() => {
    handleSet();
  }, []);


  // This handleSave method deals with saving the user's information successfully into the correct record if that user exists in the collection. The main focus is that 
  // this method is saving the right information at the right place and after the file renders, it sets and saves the new result (displayName + photoURL) 
  // into the firebase console system. 

  // We have declared several await statements as the fetching and saving of displayName and photoURL is operating asynchronously 
  // and once this works then it shall be created and updated in our firebase console authentication records. 
  const handleSave = async () => {

    // This await statement is declared to fetch the response of the photo uri asynchronously. This may take time as through multiple images, we have selected one image and it will take
    // time to be saved.  
    const response = await fetch(uri);

    // This await statement take the blob() method which takes a reponse stream and reads it to completion. 
    // The logic behind is to return a promise that resolves with a Blob. 
    const blob = await response.blob();
    
    // This await statement takes and works over the storage of the current user id along with the blob method. 
    // Once this storage is done then the result is put in the system as blob. 
    const putResult = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .put(blob);
    
      // This await statement works by getting the downloaded URL of the current user uid from the firebase and 
      // updates the users information in the firebase console collection. 
      const url = await firebase
      .storage()
      .ref()
      .child(firebase.auth().currentUser.uid)
      .getDownloadURL();
    const updateUser = firebase.functions().httpsCallable("updateUser");
    
    // According to this await statement, we are setting and updating the photo URL and displayName information of the currentUser uid in the firebase console. 
    const response2 = await updateUser({
      uid: firebase.auth().currentUser.uid,
      displayName,
      photoURL: url
    });
    console.log("updateUser response", response2);
    console.log("new displayName", firebase.auth().currentUser.displayName);
    setPhotoURL(url);
  };


  // This handlePickImage runs when a user picks an image from their phone library or gallery. 
  // When the image has been picked successfully. it sets the uri to that particular chosen image. 

  const handlePickImage = async () => {
    // These statements are showing the camera roll and allowing users to select. 
    // An await statement term is declared over here as the image picker which is associated within the launchImageLibraryAsync operates and works asynchronously. 
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    // According to this if statement, we are checking that if the result is not cancelled then the chosen uri shall be set in the system. 
    if (!result.cancelled) {
      console.log("not cancelled", result.uri);
      setUri(result.uri);
    }
  };


  // This handleSubscription method runs when the user is given an opportunity by our parking app to select a subscription for themselves. 
  // Based on each type of subscription the user selects, it will be processed and they shall earn carWashPoints and valetPoints. 

  // We have three types of subscriptions and each one of them has different conditions which are as follows: 
  const handleSubscription = () => {

    // 1- Bronze (if bronze is selected, then the user shall receive the bronze subscription and their details shall be set in the subscription collection (firebase)).
    if (subscription === "bronze") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "bronze",
        carWashPoints: 1,
        valetPoints: 2,
      })
    }

    // 2- Silver (if silver is selected, then the user shall receive the silver subscription and their details shall be set in the subscription collection (firebase)).
    else if (subscription === "silver") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "silver",
        carWashPoints: 2,
        valetPoints: 4,
      })
    }

    // 3- Gold (if gold is selected, then the user shall receive the gold subscription and their details shall be set in the subscription collection (firebase)).
    else if (subscription === "gold") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "gold",
        carWashPoints: 3,
        valetPoints: 6,
      })
    }

  };


  // This is our main return statement where our parking app content shall be rendered and displayed on our parking app screens. 
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={{ flexDirection: "row", marginLeft: 100 }}>
        <View>
          <SocialIcon
            type='foursquare'
          />
        </View>

        <View>
          <Text style={{ fontSize: 25, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>SETTINGS</Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}></View>

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

      {/* This condition is used to check whether the photoURL is null or not. If it is null then it will be updated with a new image when the user
      selects and chooses it from their camera roll. */}
      {photoURL !== "" && (
        <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
      )}

      <View style={{ marginTop: 10 }}></View>

      <Animatable.View animation="flipInX" duration={2000} direction="alternate">

        {/* React Navigation: This button "PICK IMAGE" is part of the react navigation system and it allows the user to navigate to their image gallery, pick images, crop them and choose
        the final edited image for their profile.  */}

        <Button
          icon={
            <MaterialIcons
              name="image"
              color="white"
              size={15}
            />
          }
          title=" PICK IMAGE"
          onPress={handlePickImage}
        />
      </Animatable.View>

      <View style={{ marginTop: 10 }}></View>

      <Animatable.View animation="flipInX" duration={2000} direction="alternate">

        <Button
          icon={
            <MaterialIcons
              name="save"
              color="white"
              size={15}
            />
          }
          title=" SAVE"
          onPress={handleSave}
        />
      </Animatable.View>

      <View style={{ marginTop: 10 }}></View>

      <View>
        {/* According to this condition, if the current user has not applied or select any subscription and their subscription record in their collection's database is empty
        then they shall see the form of the Subscription where they have a chance to apply for a subscription. Otherwise, they shall view their stored subscription information from the 
        database on their Settings Screen which includes: car wash points, type of user subscription, and user subscription valet points.  
        */}
        {flag == false ? <View>
          <Text>
            Subscription
        </Text>
          <View>
            <Picker
              selectedValue={"Pick a Department"}
              style={{ height: 50, width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                setSubscription(itemValue)
              }>
              <Picker.Item label="Select a Department" value="" />
              <Picker.Item label="Bronze Price:15" value="bronze" />
              <Picker.Item label="Silver Price:30" value="silver" />
              <Picker.Item label="Gold Price:50" value="gold" />
            </Picker>
          </View>

          <View style={{ marginTop: 10 }}></View>

          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            <Button
              icon={
                <MaterialIcons
                  name="subscriptions"
                  color="white"
                  size={15}
                />
              }
              title=" SUBSCRIBE AND PAY"
              onPress={handleSubscription}
            />
          </Animatable.View>

          <View style={{ marginTop: 10 }}></View>

          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            {/* React Navigation: This button "VISIT TO PARKING NEWS" is part of the react navigation system and it allows the user to navigate to the News Screen where they get a chance
            to view any latest news about the parking areas or parking announcements at CNAQ.  */}

            <Button
              icon={
                <Entypo
                  name="news"
                  color="white"
                  size={15}
                />
              }
              title=" VISIT TO PARKING NEWS"
              onPress={() => props.navigation.navigate("NewsStack")}
            />
          </Animatable.View>

          <View style={{ marginTop: 10 }}></View>

          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            {/* React Navigation: This button "MY SUGGESTIONS SCREEN" is part of the react navigation system and it allows the user to navigate to their suggestions screen, where they 
            can type suggestions about any user type like cleaner and submit them. This will allow our parking app management to find out that which user has good or bad comments from
            all users registered in the system. */}
            <Button
              icon={
                <MaterialIcons
                  name="filter-list"
                  color="white"
                  size={15}
                />
              }
              title=" MY SUGGESTIONS SCREEN"
              onPress={() => props.navigation.navigate("SuggestionsStack")}
            />
          </Animatable.View>

        </View>
          : <View>
            <Text>Car Wash Point: {userSub.carWashPoints}</Text>
            <Text>Type: {userSub.type}</Text>
            <Text>Valet Point: {userSub.valetPoints}</Text>
          </View>
        }

      </View>
    </ScrollView>
  );
}

// I have declared the header of the Settings Screen's navigation option to null and I have declared a Text Component as the heading of the screen. 
SettingsScreen.navigationOptions = {
  header: null
};

// These are the styles which we are applying through our stylesheet react native component on this file. 
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

export default SettingsScreen;
