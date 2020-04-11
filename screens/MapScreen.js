import * as WebBrowser from "expo-web-browser";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {Button} from "react-native-elements"
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  TextInput,
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

export default function MapScreen(props) {
  /* react native hook useState is being used to initialize data */
  const [location, setLocation] = useState({coords:{latitude:0,longitude:0}});
  /* react native hook useState is being used to initialize data */
  const [parkings, setParkings] = useState([]);
  const [chosen, setChosen] = useState([]);
  // i used this variable because i was having a problem with the parkings
  // not loading in time therefore giving me errors. i used a second 
  // variable to help me solve that problem
  let ppp = [];
  const DELAY = 10;
  console.disableYellowBox = true;

//     useEffect(() => {
//     _getLocationAsync();
//   });

// // this useEffect is just a listener that will make sure that
// // the current user location is always up to date
//   useEffect(() => {
//     _getLocationAsync();
//   }, [location]);

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
    // console.log("donnnnnnnnnnnnnnnnnne init: ", parkings);
    ppp = temp;
    setParkings(temp);
};



//   const simulate = async () => {
//     // get necessary data from db for simulation to start
//     // await init()

//     // simulate something (e.g. db update) every DELAY seconds
//     setInterval(async () => {
      
//         // select a random item
//         const i = Math.floor(Math.random() * ppp.length)

//         // change it somehow
//         // - must modify local copy of db data
//         //   to avoid reloading from db
//         const rnd = Math.random()
//         let choice = ""

//         // - use percentages to decide what to do
//         // - change to suit your own needs
//         if(rnd < 0.3333) {
//             choice = "free"
//         } else if (rnd < .6666) {
//             choice = "taken"
//         } else {
//             choice = "hold"
//         }
//         ppp[i].status = choice
        
//         // update the db
    
//         console.log('parking after simulation',ppp)
//         setParkings(ppp);
//         /* this code in the simulate method was messing up my database
//            so i added some changes to it to make it work in my favor.
//            i made it work with subcollections. i removed the id that was 
//            being added inside my parkings because the database is not 
//            made that way.*/
//         await db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection('c-2').doc(ppp[i].parkingNumber).set(ppp[i]);
//         console.log('simulated with item[', i, ']: ', ppp[i].status)
//     }, DELAY * 1000)

// }

/* this method will get the user's current location as an object
   so that it will be used later */
 const _getLocationAsync = async () => {
     // this await is here because in order for the map to work
     // i need the current user location. for that i need the permission
     // that is why im awaiting it
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    // here im waiting for the location itself
    let loca = await Location.getCurrentPositionAsync({});
    setLocation(loca)
    //console.log(location)
  };

 
  /* this method in progress but it will add the reserved parking 
  to an array so the user can reserve more than one parking 
  at once*/
  const handleAdd = (i) => {
    console.log('chosen parking',chosen);
    var temp = chosen;
    console.log(i.status);
    if(i.status === 'free'){
      if(!temp.includes(i)){
        temp.push(i);
        setChosen(temp);
      } else{
        alert('you have already chosen this parking lot')
      }
    
    } 
    else if(i.status === 'hold'){
      alert('please stand by this parking is on hold');
    }
    else{
      alert('this parking is not available')
    }
  };

  const handleReserve = () => {
    props.navigation.navigate('Reservation',{chosen:chosen})
  };

  return (
    location && 
    <View style={styles.container}>
      {/*
        MapView  will show the map to the user. properties used: showUserLocation will
        show the users current location. followUserLocation i made it false for now
        because it is annoying while testing but it will be true. 
        mapType will select the type of map view to be shown.
      */}
      
      <MapView
        style={{width:"100%",height:500,flex:1}}
        showsUserLocation={true}
        followsUserLocation={false}
        mapType={"satellite"}
      >
        {/* here i'm mapping the parkings array to show them as squares on the map */}
        {parkings.map((p,i) =>(
        /*
          i used markers to show the parking spots and inside the image
          property i made a condetion to check the status of the parking
          to know which color the parking is going to be.
        */
        <Marker
          onPress={() => handleAdd(p)}
          key={i}
          image={p.status === "free"? require('../assets/images/green.jpg')
          : p.status === "taken"?require('../assets/images/red.jpg')
          :require('../assets/images/yellow.jpg')}
          coordinate={{latitude:parseFloat(p.latitude),longitude:parseFloat(p.longitude)}}
          title={`parking No.${p.parkingNumber}`}
          description={`Press here to reserve parking number ${p.parkingNumber}`}
        />

        ))}
        {/* this marker is the users ca which is by default on their
            current location. this will be used later to show the user
            where they parked because it will stay on the square (parking) */}
        {/* <Marker
          image={require('../assets/images/carIcon.png')}
          coordinate={{latitude:location.coords.latitude,longitude:location.coords.longitude}}
          title={"My Car"}
          description={"this is your car's current location"}
        /> */}
    
    </MapView>
    <Button title="Reserve" type="outline" onPress={handleReserve} />  
    
    </View>
  );
}

MapScreen.navigationOptions = (props) => ({
    title: "Parking Map",
    headerStyle: { backgroundColor: "white" },
    headerTintColor: "black",
    headerTintStyle: { fontWeight: "bold" }
})

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
  MapScreenFilename: {
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
