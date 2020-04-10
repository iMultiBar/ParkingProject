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
  View
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

/* right now this page is for the admin to access the news
   with a couple of if statements the user will be able to view 
   the News from this screen*/
export default function NewsScreen() {
  const [news, setNews] = useState([]);
  // const [pDate, setPDate] = React.useState("");
  // const [eDate, setEDate] = React.useState("");
  // const [subjet, setSubjet] = React.useState("");
  // const [description, setDescription] = React.useState("");

  /*
    this useEffect will get the data from the database collection 'News'
    push it into the news variable
  */
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

  // this method will delete news from the database(by the admin)
  const handleDelete = (i) => {
    const d = news[i];
    console.log(d);
    db.collection("news").doc(d.id).delete()
  };


  /* this method will be responsible of adding news to the database */
  // const handleAdd = async () => {
  //   const uid = firebase.auth().currentUser.uid;
  //   db.collection("suggestions")
  //     .doc()
  //     .set({
  //       uid,
  //       description,
  //       dateTime: moment().format('DD/MM/YYYY, h:mm:ss a'),
  //       type,
  //       status:'unapproved'
  //     });
  // };


  const handleLogout = () => {
    firebase.auth().signOut();
  };


  return (
    <View style={styles.container}>
     
      <Animatable.Text animation='zoomIn'  direction="normal" iterationCount='5'>
        <Text style={{textAlign:"center",fontSize:50, flex:1,marginTop:15}}>News Feed</Text>
      </Animatable.Text>
      <View style={{flex:4}}>
      {/* this map will show the news that had been retrived from the database */}
      {news.map((n,i) => (
        <Animatable.View animation='pulse'  direction="normal" iterationCount='5'>
          <View key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:15,padding:5,margin:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Subject</Text>: {n.subject}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Description</Text>: {n.description}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Publish Date</Text>: {n.datePublished}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>End Date</Text>: {n.endDate}</Text>
          {/* this TouchableOpacity is used to call the delete method */}
          <TouchableOpacity onPress={() => handleDelete(i)}><Text style={{color:"red"}}>Delete</Text></TouchableOpacity>
        </View>
      </Animatable.View>
        
      ))}
      </View>
      <Button title="Logout" onPress={handleLogout} /> 
    </View>
  );
}

NewsScreen.navigationOptions = {
  title:"News",
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
    justifyContent:"center",
    alignContent:"center"
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
