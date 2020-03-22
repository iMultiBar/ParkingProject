import * as WebBrowser from "expo-web-browser";
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

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import moment from 'moment';

export default function SuggestionsScreen() {
  const [suggestions, setSuggestions] = useState([]);

  const [email, setEmail] = useState("");  
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

//   useEffect(() => {
//     db.collection("messages").onSnapshot(querySnapshot => {
//       const messages = [];
//       querySnapshot.forEach(doc => {
//         messages.push({ id: doc.id, ...doc.data() });
//       });
//       console.log(" Current messages: ", messages);
//       setMessages([...messages]);
//     });
//   }, []);

  const handleSubmit = async () => {
    const uid = firebase.auth().currentUser.uid;
    db.collection("suggestions")
      .doc()
      .set({
        uid,
        description,
        dateTime: moment().format('DD/MM/YYYY, h:mm:ss a'),
        type,
        status:'unapproved'
      });
  };

//   const handleEdit = message => {
//     setTo(message.to);
//     setText(message.text);
//     setId(message.id);
//   };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
        <Text style={{textAlign:"center",fontSize:40, flex:1,marginTop:15}}>submit your suggestion below</Text>
        <View style={{flex:1}}>
        <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setDescription}
            placeholder="What is your suggestion"
            value={description}
        />
        <Picker
        mode="dialog"
          selectedValue={type}
          style={{height: 50, width: "100%"}}
          onValueChange={(itemValue, itemIndex) =>
            setType(itemValue)
          }>
          <Picker.Item label="who should see this suggestion" value="" />
          <Picker.Item label="Cleaners" value="Cleaners" />
          <Picker.Item label="Porters" value="Porters" />
          <Picker.Item label="Parking Maintenance" value="Maintenance" />
          <Picker.Item label="Managment" value="health and science" />
          <Picker.Item label="IT Department" value="IT Department" />
        </Picker>

        </View>
        <Button title="submit" onPress={handleSubmit} />
        <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

SuggestionsScreen.navigationOptions = {
    title:"suggestion",
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
