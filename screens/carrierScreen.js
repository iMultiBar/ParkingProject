import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableWithoutFeedback } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { Card, Input } from "react-native-elements";



export default function carrierScreen() {
  const [jobs, setJobs] = useState([]);
  const [carrierJobs, setCarrierJobs] = useState([])
  const [flag, setFlag] = useState(true)

  useEffect(() =>{
    getJobs()
  },[])

  const getJobs = async () =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").onSnapshot(querySnapshot => {
      const jobs = [];
      const carrierJobs = []
      querySnapshot.forEach(doc => {
        let check = doc.data()
        if(check.carrierUid === null){
          jobs.push({ id: doc.id, ...doc.data() });
        }
        else if(check.carrierUid === firebase.auth().currentUser.uid && check.status != "done"){
          carrierJobs.push({id: doc.id, ...doc.data()})
        }
      });
      // console.log(" Current jobs: ", jobs);
      setJobs([...jobs]);
      setCarrierJobs([...carrierJobs])
    });
  }


  const takeCarrierRequest = (n) =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").doc(n.id).update({
      carrierUid: firebase.auth().currentUser.uid,
      date: n.date,
      parkingLocation: n.parkingLocation,
      platNumber: n.platNumber,
      status: "taken"
    })
  }

  const completeCarrierRequest = (n) =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").doc(n.id).update({
      carrierUid: firebase.auth().currentUser.uid,
      date: n.date,
      parkingLocation: n.parkingLocation,
      platNumber: n.platNumber,
      status: "done"
    })
  }

  return (
    flag ? 
    <ScrollView style={styles.container}>
      <Button title="Profile" onPress={() =>setFlag(false)} />
      <View style={{flex:4}}>
        
      {jobs.map((n,i) => (
       
        <Animatable.View animation="slideInDown" iterationCount={3} direction="alternate">

          <Card key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status? "true": "avaliable"}</Text>
          {/* this button the triggers the functions which it explaned apove */}
          <Button title="Take the request" onPress={() =>takeCarrierRequest(n)} />
        </Card>
          </Animatable.View>
        
      ))}
      </View>
    </ScrollView>
    :
    <ScrollView style={styles.container}>
      <Button title="Back" onPress={() =>setFlag(true)} />
      <View style={{flex:4}}>
        
      {carrierJobs.map((n,i) => (
       
        <Animatable.View animation="slideInDown" iterationCount={3} direction="alternate">

          <Card key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status}</Text>
          {/* this button the triggers the functions which it explaned apove */}
          <Button title="Request is done" onPress={() =>completeCarrierRequest(n)} />
        </Card>
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
