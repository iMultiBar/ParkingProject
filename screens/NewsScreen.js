import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import { MaterialIcons, Entypo } from "@expo/vector-icons";

import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import * as Animatable from "react-native-animatable";



const NewsScreen = props => {
  const [news, setNews] = useState([]);
  // const [pDate, setPDate] = React.useState("");
  // const [eDate, setEDate] = React.useState("");
  // const [subjet, setSubjet] = React.useState("");
  // const [description, setDescription] = React.useState("");


  useEffect(() => {
    db.collection("news").onSnapshot(querySnapshot => {
      const news = [];
      querySnapshot.forEach(doc => {
        news.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current news: ", news);
      setNews([...news]);
    });
  }, []);

  // const handleSend = async () => {
  //   const from = firebase.auth().currentUser.uid;
  //   if (id) {
  //     db.collection("messages")
  //       .doc(id)
  //       .update({ from, to, text });
  //   } else {

  //     // call serverless function instead
  //     const sendMessage = firebase.functions().httpsCallable("sendMessage");
  //     const response2 = await sendMessage({ from, to, text });
  //     console.log("sendMessage response", response2);

  //     // db.collection("messages").add({ from, to, text });
  //   }
  //   setTo("");
  //   setText("");
  //   setId("");
  // };

  // const handleEdit = message => {
  //   setTo(message.to);
  //   setText(message.text);
  //   setId(message.id);
  // };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginLeft: 100 }}>
        <View>
          <SocialIcon
            type='foursquare'
          />
        </View>

        <View>
          <Text style={{ fontSize: 25, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>NEWS FEED</Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}></View>

      <View style={{ flex: 4 }}>
        {news.map((n, i) => (
          <View key={i} style={{ borderColor: "black", borderWidth: 3, borderStyle: "solid", marginBottom: 20, padding: 5 }}>
            <Text><Text style={{ fontWeight: 'bold' }}>Subject</Text>: {n.subject}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>Description</Text>: {n.description}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>Publish Date</Text>: {n.datePublished}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>End Date</Text>: {n.endDate}</Text>
          </View>
        ))}
      </View>

      
      <Animatable.View animation="lightSpeedIn" direction="alternate" duration={1000}>
        <Button
          icon={
            <Entypo
              name="news"
              color="white"
              size={15}
            />
          }
          title=" BACK TO SETTINGS"
          onPress={() => props.navigation.navigate("SettingsStack")}
        />
      </Animatable.View>

      <View style={{ marginTop: 10 }}></View>

      <Animatable.View animation="lightSpeedIn" direction="alternate" duration={1000}>
        <Button
          icon={
            <Entypo
              name="news"
              color="white"
              size={15}
            />
          }
          title=" LOGOUT"
          onPress={handleLogout}
        />
      </Animatable.View>

    </View>
  );
}

NewsScreen.navigationOptions = {
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center"
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

export default NewsScreen;
