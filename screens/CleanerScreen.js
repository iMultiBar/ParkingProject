import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableWithoutFeedback } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import { Card, Input } from "react-native-elements";

export default function CleanerScreen() {
  const [jobs, setJobs] = useState([]);
  const [cleanerJobs, setCleanerJobs] = useState([])
  const [flag, setFlag] = useState(true)

  useEffect(() =>{
    getJobs()
  },[])

  const getJobs = async () =>{
    db.collection("requests").doc("clean").collection("cleanRequest").onSnapshot(querySnapshot => {
      const jobs = [];
      const cleanerJobs = []
      querySnapshot.forEach(doc => {
        let check = doc.data()
        if(check.cleanerUid === null){
          jobs.push({ id: doc.id, ...doc.data() });
        }
        else if(check.cleanerUid === firebase.auth().currentUser.uid && check.status != "done"){
          cleanerJobs.push({id: doc.id, ...doc.data()})
        }
      });
      console.log(" Current jobs: ", jobs);
      setJobs([...jobs]);
      setCleanerJobs([...cleanerJobs])
    });
  }

  const takeCLeanRequest = (n) =>{
    db.collection("requests").doc("clean").collection("cleanRequest").doc(n.id).update({
      cleanerUid: firebase.auth().currentUser.uid,
      date: n.date,
      parkingLocation: n.parkingLocation,
      platNumber: n.platNumber,
      status: "taken"
    })
  }
  const completeCLeanRequest = (n) =>{
    db.collection("requests").doc("clean").collection("cleanRequest").doc(n.id).update({
      cleanerUid: firebase.auth().currentUser.uid,
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
          <Button title="Take the request" onPress={() =>takeCLeanRequest(n)} />
        </Card>
          </Animatable.View>
        
      ))}
      </View>
    </ScrollView>
    :
    <ScrollView style={styles.container}>
      <Button title="Back" onPress={() =>setFlag(true)} />
      <View style={{flex:4}}>
        
      {cleanerJobs.map((n,i) => (
       
        <Animatable.View animation="slideInDown" iterationCount={3} direction="alternate">

          <Card key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status}</Text>
          {/* this button the triggers the functions which it explaned apove */}
          <Button title="Request is done" onPress={() =>completeCLeanRequest(n)} />
        </Card>
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
