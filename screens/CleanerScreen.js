import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableWithoutFeedback } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function CleanerScreen() {
  const [jobs, setJobs] = useState([]);// this react hook useState uses to store a array of object which is the jobs

  // this this react hook useEffect loads after everything loaded which
  // uses a firebase query that listen to firebase in real time which it will loop though documents .each time a user request a clean.
  // it will display the request immediately. which set the request inside the (jobs) object.
  // also the firebase query only shows the request that other cleaners didn't took.
  // by implementing an if statment which it will check if the cleanerUid is filled in the database.
  // which will push the documents that have cleanerUid as null which means no one from the staff took it yet.
  useEffect(() =>{
    db.collection("requests").doc("clean").collection("cleanRequest").onSnapshot(querySnapshot => {
      const jobs = [];
      querySnapshot.forEach(doc => {
        let check = doc.data()
        if(check.cleanerUid === null){
          jobs.push({ id: doc.id, ...doc.data() });
        }
      });
      console.log(" Current jobs: ", jobs);
      setJobs([...jobs]);
    });
  },[])


  // this function have an arrgument called (n) which is the request object that the cleaner selected.
  // also the function have firebase query which update the selected request with the cleaner UID which from it this reuqest now belongs to him/her.
  const takeCLeanRequest = (n) =>{
    db.collection("requests").doc("clean").collection("cleanRequest").doc(n.id).update({
      cleanerUid: firebase.auth().currentUser.uid,
      date: n.date,
      parkingLocation: n.parkingLocation,
      platNumber: n.platNumber,
      status: n.status
    })
  }

  return (
    // this react native component is scrollView which helps the user to scroll between the reuqests 
    <ScrollView style={styles.container}>
      <View style={{flex:4}}>
        {/* this map functions loops inside jobs array of objects which display all the available requests.  */}
      {jobs.map((n,i) => (
        // this react native component called Animatable which animate a upside down animation that cheers the users and make them happy.or sad :)
        <Animatable.View animation="slideInDown" iterationCount={3} direction="alternate">

          <View key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status? "true": "false"}</Text>
          {/* this button the triggers the functions which it explaned apove */}
          <Button title="Take the request" onPress={() =>takeCLeanRequest(n)} />
        </View>
          </Animatable.View>
        
      ))}
      </View>
    </ScrollView>
  );
}

CleanerScreen.navigationOptions = {
  title: 'CleanerScreen',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
