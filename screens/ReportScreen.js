import * as WebBrowser from "expo-web-browser";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  
} from "react-native";

import {Marker} from 'react-native-maps';
import MapView from 'react-native-maps';

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
require("firebase/firestore");

import Message from "./Message.js";

export default function HomeScreen() {
    const [topic, setTopic] = useState();
    const [date, setDate] = useState();
    const [problem, setProblem] = useState();
    const [target, setTarget] = useState();
    const [from, setFrom] = useState(firebase.auth().currentUser.uid);


  console.disableYellowBox = true;
  
//   useEffect(() => {
//     // simulate();
//   }, []);

 

  const handleReport = () => {
    
  };

  return (
    <View style={styles.container}>

    <View style={{flex:1,justifyContent:"center"}}>
    <Text style={{fontSize:30}}>Choose a Topic to file a report or a complaint on</Text>
    <Picker
    
          mode="dialog"
          selectedValue={"select a topic"}
          style={{height: 50, width: "100%"}}
          onValueChange={(itemValue, itemIndex) =>
            setTopic(itemValue)
          }>
          <Picker.Item label="select a topic" value={null} />
          <Picker.Item label="Equepments" value="Equepments" />
          <Picker.Item label="Other Drivers" value="Other Drivers" />
          <Picker.Item label="Cleaners/Porters" value="Cleaners/Porters" />
        </Picker>
        <Text style={{fontSize:15}}>What was the problem that you would like to report</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setProblem}
          placeholder="Problem"
          value={problem}
        />
        {topic === "Equepments"?
            <>
            <Text style={{fontSize:15}}>Please describe what and where is that equipment!</Text>
            <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setTarget}
            placeholder="Equipment Description"
            value={target}
          />
          </>
          :
          topic === "Other Drivers"?
          <>
            <Text style={{fontSize:15}}>Please provide the car plate of the driver who broke the rules!</Text>
            <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={setTarget}
                placeholder="Car Plate"
                value={target}
            />
        </>
        :
        topic === "Cleaners/Porters"?
        <>
        <Text style={{fontSize:15}}>Enter the request ID that you have a problem with</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setTarget}
          placeholder="Request ID"
          value={target}
        />
        </>
        :
        null
        }
    </View>

    <Button title="Submit Report/Complaint" onPress={handleReport} />  
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

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