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
// import DatePicker from 'react-native-datepicker'; 
import moment from 'moment';


/* right now this page is for the admin to access the news
   with a couple of if statements the user will be able to view 
   the News from this screen*/
export default function HistoryScreen(props) {
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");
  const [user, setUser] = useState("");
  const [history, setHistory] = useState([]);


  /*
    this useEffect will get the data from the database collection 'News'
    push it into the news variable
  */
  // useEffect(() => {
  //   getHistory();
  //  }, [user]);

  const getHistory = async () =>{
    var temp = [];
    const querySnapshot = await db.collection("users").doc(firebase.auth().currentUser.uid).
    collection("history").get()
    querySnapshot.forEach(doc => {
      temp.push({ id: doc.id, ...doc.data() });
    });
    setHistory(temp);
  }

  useEffect(() => {
    getUser();
    getHistory();
  }, []);

  const getUser = async () => {
    const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
    setUser(User.data());
    
}

  // this method will delete news from the database(by the admin)
  const handleDelete = (i) => {
    const d = history[i];
    // console.log(d);
    db.collection("user").doc(firebase.auth().currentUser.uid).collection('history').doc(d.id).delete()
  };

  const handleReserve = async (i) => {
    // console.log('history');
    const Parking = await db.collection("parking").doc('yq4MTqaC4xMaAf9HArZp').collection('c-2')
    .doc(history[i].parkingNumber).get();
    // console.log(Parking.data().status);
    if(Parking.data().status === 'free'){
      let chosen = [];
      chosen.push(Parking.data());
      props.navigation.navigate('Reservation',{chosen:chosen})
    } else {
      alert('sorry but this spot is currently taken or on hold');
    }
    
  };



  const handleLogout = () => {
    firebase.auth().signOut();
  };


  return (
    <ScrollView >
      <View style={styles.container}>
     
     <Text style={{textAlign:"center",fontSize:50, flex:1,marginTop:15}}>Parking History</Text>
   <View style={{flex:4}}>
   {/* this map will show the news that had been retrived from the database */}
   {history.map((n,i) => (
     <Animatable.View key={i} animation='pulse'  direction="normal" iterationCount={5}>
       <View  style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:15,padding:5,margin:5}}>
       <Text><Text style={{ fontWeight: 'bold' }}>Start Date</Text>: {n.startDate}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>End Date</Text>: {n.endDate}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>Parking Number</Text>: {n.parkingNumber}</Text>
       {/* this TouchableOpacity is used to call the delete method */}
       <TouchableOpacity onPress={() => handleDelete(i)}><Text style={{color:"red"}}>Delete</Text></TouchableOpacity>
       <TouchableOpacity onPress={() => handleReserve(i)}><Text style={{color:"green"}}>Rserve Again</Text></TouchableOpacity>

     </View>

   </Animatable.View>
     
   ))}


   </View>
   
   
 </View>
 <Button title="Logout" onPress={handleLogout} /> 
    </ScrollView>
  );
}

HistoryScreen.navigationOptions = {
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
