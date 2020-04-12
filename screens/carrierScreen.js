import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableWithoutFeedback } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function carrierScreen() {
  const [jobs, setJobs] = useState([]);

  useEffect(() =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").onSnapshot(querySnapshot => {
      const jobs = [];
      querySnapshot.forEach(doc => {
        let check = doc.data()
        if(check.cleanerUid === null){
          jobs.push({ id: doc.id, ...doc.data() });
        }
      });
      setJobs([...jobs]);
    });
  },[])


  const takeCarrierRequest = (n) =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").doc(n.id).update({
      carrierUid: firebase.auth().currentUser.uid,
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
        
        <Animatable.View animation="slideInDown" iterationCount={3} direction="alternate">

          <View key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status? "true": "false"}</Text>
          
          <Button title="Take the request" onPress={() =>takeCarrierRequest(n)} />
        </View>
          </Animatable.View>
        
      ))}
      </View>
    </ScrollView>
  );
}

carrierScreen.navigationOptions = {
  title: 'carrierScreen',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
