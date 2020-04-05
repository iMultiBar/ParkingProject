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

// The three react native elements which I have used = Button, Text, SocialIcon. 
import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import * as Animatable from "react-native-animatable";


const SettingsScreen = props => {
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(false); // This useState property set as boolean type 
  //is responsible for setting up a permission for Camera on our phone. 

  const [displayName, setDisplayName] = useState(""); // This is a string useState property "displayName" which belongs to the user who has registered and logged into the system. 
  const [uri, setUri] = useState(""); // This is a string useState property "uri" which is used to set the url of the photo which the user selects from his phone system to create his profile avatar. 
  const [photoURL, setPhotoURL] = useState(""); // This is a string useState property "photoURL" where the url of the photo is set. 
  const [subscription, setSubscription] = useState("") // This is a string useState property "subscripton" which is created when the user selects the information for their subscription. 
  const [flag, setFlag] = useState(false); // A boolean useState property which is used for setting the flag of a component. 
  const [userSub, setUserSub] = useState([]) // useState property in terms of an array to set all the user's subscriptions in the form of an array in the subscriptions collection. 


  // This method is responsible for asking permission on the phone when the user wants to access the photos from the gallery. Once the 
  // permission has been granted by the user to the system, the user can access the images in the gallery. 
  const askPermission = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    setHasCameraRollPermission(status === "granted");
  };

  // This useEffect method is responsible for rendering the askPermission method after evey render. This is because we want the user to have a choice to grant 
  // permissions after every change in the system. 
  useEffect(() => {
    askPermission();
  }, []);


  // This handleSet method is responsible for setting the displayName and the photoURL of the user into the users collections. Each time a user selects and changes their displayName
  // and photoURL, this method shall run on call to set the information to the new one in the users collections. 

  // Furthermore, if the user wants to take a subscription, the setting of their displayName and photoURL shall be done based on their selected subscription. 
  const handleSet = async () => {
    const user = firebase.auth().currentUser;
    setDisplayName(user.displayName);
    setPhotoURL(user.photoURL);


    let check = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
    if (check.data()) {
      setFlag(true)
      setUserSub(check.data())
    }
  };


  // This useEffect method is responsible for running the handleSet method after every render happens. It sets and replaces the new information which has been updated by the user with
  // the original one in the users collection. 
  useEffect(() => {
    handleSet();
  }, []);


  // This handleSave method deals with saving the user's information successfully into the correct record if that user exists in the collection. The main focus is that 
  // this method is saving the right information at the right place and after the file renders, it sets and saves the new result (displayName + photoURL) 
  // into the firebase console system. 
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


  // This handlePickImage runs when a user picks an image from their phone library or gallery. 
  // When the image has been picked successfully. it sets the uri to that particular chosen image. 
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


  // This handleSubscription method runs when the user is given an opportunity by our parking app to select a subscription for themselves. 
  // We have three types of subscriptions and each one of them has different conditions: 
  // 1- Bronze (if bronze is selected, then the user shall receive the bronze subscription and their details shall be set in the subscription collection (firebase)).
  // 2- Silver (if silver is selected, then the user shall receive the silver subscription and their details shall be set in the subscription collection (firebase)).
  // 3- Gold (if gold is selected, then the user shall receive the gold subscription and their details shall be set in the subscription collection (firebase)).
  const handleSubscription = () => {
    if (subscription === "bronze") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "bronze",
        carWashPoints: 1,
        valetPoints: 2,
      })
    } else if (subscription === "silver") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "silver",
        carWashPoints: 2,
        valetPoints: 4,
      })
    } else if (subscription === "gold") {
      db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
        type: "gold",
        carWashPoints: 3,
        valetPoints: 6,
      })
    }

  };


  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={{ flexDirection: "row", marginLeft: 100 }}>
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
      {photoURL !== "" && (
        <Image style={{ width: 100, height: 100 }} source={{ uri: photoURL }} />
      )}

      <View style={{ marginTop: 10 }}></View>

      {/* This is an animation of type "flipXIn" which I have applied on one of my buttons "PICK IMAGE". This is a type of "Flipper" entrance animation which appears in a flip action manner.

        I have applied the "duration" property to specify how long the animation cycle should take. The time is specified in seconds or milliseconds, and is initially set to '0s', which means that the animation occurs instantaneously. 
        You can specify one duration or multiple comma-separated durations.
        
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

      <Animatable.View animation="flipInX" duration={2000} direction="alternate">
        {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

        {/* This button also includes an icon which is of type "image". The icon belongs to the library "MaterialIcons" and this is of size 15 and color "white".  */}

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


      {/* This is an animation of type "flipXIn" which I have applied on one of my buttons "PICK IMAGE". This is a type of "Flipper" entrance animation which appears in a flip action manner.
       
        I have applied the "duration" property to specify how long the animation cycle should take. The time is specified in seconds or milliseconds, and is initially set to '0s', which means that the animation occurs instantaneously. 
        You can specify one duration or multiple comma-separated durations.
        
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

      <Animatable.View animation="flipInX" duration={2000} direction="alternate">
        {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

        {/* This button also includes an icon which is of type "save". The icon belongs to the library "MaterialIcons" and this is of size 15 and color "white".  */}

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


          {/* This is an animation of type "flipXIn" which I have applied on one of my buttons "PICK IMAGE". This is a type of "Flipper" entrance animation which appears in a flip action manner.
       
        I have applied the "duration" property to specify how long the animation cycle should take. The time is specified in seconds or milliseconds, and is initially set to '0s', which means that the animation occurs instantaneously. 
        You can specify one duration or multiple comma-separated durations.
        
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

            {/* This button also includes an icon which is of type "subscriptions". The icon belongs to the library "MaterialIcons" and this is of size 15 and color "white".  */}

            {/* When the user click this button, it finalizes their subscription, add that particular subscription with the user's information in the subscription collection.  */}

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


          {/* This is an animation of type "flipXIn" which I have applied on one of my buttons "PICK IMAGE". This is a type of "Flipper" entrance animation which appears in a flip action manner.
       
        I have applied the "duration" property to specify how long the animation cycle should take. The time is specified in seconds or milliseconds, and is initially set to '0s', which means that the animation occurs instantaneously. 
        You can specify one duration or multiple comma-separated durations.
        
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}

          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

            {/* This button also includes an icon which is of type "news". The icon belongs to the library "Entypo" and this is of size 15 and color "white".  */}

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


          {/* This is an animation of type "flipXIn" which I have applied on one of my buttons "PICK IMAGE". This is a type of "Flipper" entrance animation which appears in a flip action manner.
       
        I have applied the "duration" property to specify how long the animation cycle should take. The time is specified in seconds or milliseconds, and is initially set to '0s', which means that the animation occurs instantaneously. 
        You can specify one duration or multiple comma-separated durations.
        
        I have applied the "direction" property which indicates in which direction the animation is played. I have chosen "alternate" which represents the direction being present at one 
        place and not moving clockwise or anticlockwise.  */}
          <Animatable.View animation="flipInX" duration={2000} direction="alternate">

            {/* This is the third react native element which I have used in my file. Buttons are touchable elements used to interact with the screen. 
          They may display text, icons, or both. Buttons can be styled with several props to look a specific way. */}

            {/* This button also includes an icon which is of type "filter-list". The icon belongs to the library "MaterialIcons" and this is of size 15 and color "white".  */}

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

// SettingsScreen.navigationOptions = {
//   title: "Settings"
// };

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
