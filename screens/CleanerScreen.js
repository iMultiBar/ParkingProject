import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import { MaterialIcons, Entypo } from "@expo/vector-icons";

import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import * as Animatable from "react-native-animatable";


const CleanerScreen = props => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    db.collection("requests").doc("clean").collection("cleanRequest").onSnapshot(querySnapshot => {
      const jobs = [];
      querySnapshot.forEach(doc => {
        let check = doc.data()
        if (check.cleanerUid === null) {
          jobs.push({ id: doc.id, ...doc.data() });
        }
      });
      console.log(" Current jobs: ", jobs);
      setJobs([...jobs]);
    });
  }, []);



  const takeCleanRequest = (n) => {
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
      <View style={{ flexDirection: "row", marginLeft: 40 }}>
        <View>
          <SocialIcon
            type='foursquare'
          />
        </View>

        <View>
          <Text style={{ fontSize: 25, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>
            CLEANER SCREEN</Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}></View>


      <View style={{ flex: 4 }}>
        {jobs.map((n, i) => (
          <View key={i} style={{ borderColor: "black", borderWidth: 3, borderStyle: "solid", marginBottom: 20, padding: 5 }}>
            <Text><Text style={{ fontWeight: 'bold' }}>Date</Text>: {n.date}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.platNumber}</Text>
            <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status ? "true" : "false"}</Text>

            <View style={{ marginTop: 10 }}></View>

            <Animatable.View animation="lightSpeedIn" direction="alternate" duration={1000}>
              <Button
                icon={
                  <Entypo
                    name="news"
                    color="white"
                    size={15}
                  />
                }
                title=" TAKE THE REQUEST"
                onPress={takeCleanRequest}
              />
            </Animatable.View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

CleanerScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default CleanerScreen;
