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
  View
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
  /* react native hook useState is being used to initialize data */
  const [location, setLocation] = useState({coords:{latitude:0,longitude:0}});
  /* react native hook useState is being used to initialize data */
  const [parkings, setParkings] = useState([]);

  let ppp = [];
  const DELAY = 10;
  console.disableYellowBox = true;
  //   useEffect(() => {
  //   _getLocationAsync();
  // });

  // useEffect(() => {
  //   _getLocationAsync();
  // }, [location]);

  /*
    react native hook useEffect is going to be called after everything is rendered.
    this useEffect here will call the init() method to initialize the parking lots
    data, to be used in the map. then it will start the simulation by calling the
    simulate method.
  */
  useEffect(() => {
    init();
    // simulate();
  }, []);

  const init = async () => {
    const temp = [];
    // do once only, not a listener
    const querySnapshot = await db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").
    collection('c-2').get()
    querySnapshot.forEach(doc => {
      temp.push({ id: doc.id, ...doc.data() });
    });
    console.log("donnnnnnnnnnnnnnnnnne init: ", parkings);
    ppp = temp;
    setParkings(temp);
};



  const simulate = async () => {

    // get necessary data from db for simulation to start
    await init()

    // simulate something (e.g. db update) every DELAY seconds
    setInterval(async () => {
      
        // select a random item
        const i = Math.floor(Math.random() * ppp.length)

        // change it somehow
        // - must modify local copy of db data
        //   to avoid reloading from db
        const rnd = Math.random()
        let choice = ""

        // - use percentages to decide what to do
        // - change to suit your own needs
        if(rnd < 0.3333) {
            choice = "free"
        } else if (rnd < .6666) {
            choice = "taken"
        } else {
            choice = "hold"
        }
        ppp[i].status = choice
        
        // update the db
    
        console.log('parking after simulation',ppp)
        setParkings(ppp);
        await db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection('c-2').doc(ppp[i].parkingNumber).set(ppp[i]);
        console.log('simulated with item[', i, ']: ', ppp[i].status)
    }, DELAY * 1000)

}

 const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let loca = await Location.getCurrentPositionAsync({});
    setLocation(loca)
    //console.log(location)
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    location && 
    <View style={styles.container}>
      {/*
        react native component MapView this component will show the map to the user
        within this componenet there a are a bunch of properties. showUserLocation will
        show the users current location. followUserLocation if it was true it will force
        the map to always follow the user. finally the mapType will select the type of map view
        to be shown.
      */}
      <MapView
        style={{width:"100%",height:500,flex:1}}
        showsUserLocation={true}
        followsUserLocation={false}
        mapType={"satellite"}
      >
        {"parking in render",console.log(parkings)}
        {parkings.map((p,i) =>(
        /*
          react native component Marker this component is used inside the MapView component
          this components only job is to show markers on the map to the user. it has props 
          the image which is the image that will be shown as the marker. cordinates which
          are where this marker will show. title and describtion to show for the user when
          they click on the marker.
        */
          <Marker
          key={i}
          image={p.status === "free"? require('../assets/images/green.jpg')
          : p.status === "taken"?require('../assets/images/red.jpg')
          :require('../assets/images/yellow.jpg')}
          coordinate={{latitude:parseFloat(p.latitude),longitude:parseFloat(p.longitude)}}
          title={`parking No.${p.parkingNumber}`}
          description={`this is parking No.${p.parkingNumber} and it is ${p.status}`}
        />

        ))}
        <Marker
          image={require('../assets/images/carIcon.png')}
          coordinate={{latitude:location.coords.latitude,longitude:location.coords.longitude}}
          title={"My Car"}
          description={"this is your car's current location"}
        />
    
    </MapView>
        
    <Button title="Logout" onPress={handleLogout} />  
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
