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
  KeyboardAvoidingView,
  
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { Ionicons,Entypo,AntDesign,FontAwesome } from '@expo/vector-icons';
import ReactNativePickerModule from "react-native-picker-module"

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import moment from 'moment';

export default function SuggestionsScreen() {
  let pickerRef = null;
  console.disableYellowBox = true;
  const [suggestions, setSuggestions] = useState([]);
  const [email, setEmail] = useState("");  
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState("");


  useEffect(() => {
    getUser()
  }, []);

  useEffect(() => {
    if(user.role === 'admin'){
      getSuggestions()
    }
  }, [user]);

  const getSuggestions = async () => {
    await db.collection("suggestions").onSnapshot(querySnapshot => {
      const sug = [];
      querySnapshot.forEach(doc => {
        sug.push({ id: doc.id, ...doc.data() });
      });
      console.log(" Current suggestion: ", sug);
      setSuggestions([...sug]);
    });
}

  const getUser = async () => {
    const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
    console.log(User.data());
    setUser(User.data());
}

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

  const approve = n => {
    console.log(n.id);
    db.collection("suggestions").doc(n.id).update({
          status:'approved'
        });
  }

//   const handleEdit = message => {
//     setTo(message.to);
//     setText(message.text);
//     setId(message.id);
//   };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    user.role === 'admin'? 
    <View style={styles.container}>
       {suggestions.map((n,i) => (
     <Animatable.View key={i} animation='pulse'  direction="normal" iterationCount={5}>
       <View  style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:15,padding:5,margin:5}}>
       <Text><Text style={{ fontWeight: 'bold' }}>Type</Text>: {n.type}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>description</Text>: {n.description}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>date and time</Text>: {n.dateTime}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>From</Text>: {n.uid}</Text>
       <Text><Text style={{ fontWeight: 'bold' }}>status</Text>: {n.status}</Text>
       {/* this TouchableOpacity is used to call the delete method */}
       {n.status ==='unapproved'? <TouchableOpacity onPress={() => approve(n)}><Text style={{color:"green"}}>approve</Text></TouchableOpacity>:null}
     </View>

   </Animatable.View>
     
   ))}
    </View> 
    : 
    <ScrollView>
      <View style={styles.container}>
        <Text style={{textAlign:"center",fontSize:40, marginTop:15}}>
          We Care About What </Text><Animatable.View  animation='tada' iterationCount='infinite' direction='normal'><Text style={{textAlign:"center",fontSize:40}}>You</Text></Animatable.View> 
          <Text style={{textAlign:"center",fontSize:40}}>
          Think
          </Text>
        <View style={{flex:1}}>
        <Animatable.View  marginTop={50}  animation='bounce' iterationCount='infinite' direction='normal'><Text style={{textAlign:"center",fontSize:20}}>Give us Your Suggestion Below</Text></Animatable.View>
        <Animatable.View flex={1} marginTop={50}  animation='bounce' iterationCount='infinite' direction='normal'><FontAwesome style={{textAlign:"center",fontSize:20}} name={"arrow-down"} /></Animatable.View>

        <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={setDescription}
            placeholder="What is your suggestion"
            value={description}
        />
        {/*
          this is the picker component. this components allows the user to pick on of many
          predetermined data for the input. this will allow me to control the user's input
          some of the props are mode, which will change depending on the OS being used.
          onValueChange which will set the corresponding value above when the picks an option.
          each of the options will be in a sub component, called Picker.Item
        */}

{Platform.OS === "ios"? 
<>
        <TouchableOpacity
          onPress={() => {pickerRef.show()}}
        >
        <Text>{type === ""? "Press here to choose the type of suggestion": type}</Text>
        </TouchableOpacity>
        <ReactNativePickerModule
          pickerRef={e => (pickerRef = e)}
          selectedValue={type}
          title={'Select what the suggestion is about'}
          items={['Cleaners','Porters','Parking Maintenance','Managment','IT Department']}
           style={{height: 50, width: "100%",}}
          onCancel={() => {console.log("cancelled")}}
          onValueChange={(itemValue, itemIndex) =>
            setType(itemValue)
          } 
        />
        </>
        : 
        <Picker
        selectedValue={type}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
      >
        <Picker.Item label="Cleaners" value="Cleaners" />
        <Picker.Item label="Porters" value="Porters" />
        <Picker.Item label="Parking Maintenance" value="Parking Maintenance" />
        <Picker.Item label="Managment" value="Managment" />
        <Picker.Item label="IT Department" value="IT Department" />
      </Picker>
        }

        

        </View>
        <Button title="submit" onPress={handleSubmit} />
    </View>
    </ScrollView>
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
