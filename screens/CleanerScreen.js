import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function CleanerScreen() {
  const [jobs, setJobs] = useState([]);
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
  },[]);

  

  const takeCleanRequest = (n) =>{
    db.collection("requests").doc("clean").collection("cleanRequest").doc(n.id).update({
      cleanerUid: firebase.auth().currentUser.uid,
      date: n.date,
      parkingLocation: n.parkingLocation,
      platNumber: n.platNumber,
      status: n.status
    })
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{flex:4}}>
      {jobs.map((n,i) => (
        <View key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status? "true": "false"}</Text>
          <Button title="Take the request" onPress={() =>takeCleanRequest(n)} />
        </View>
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
