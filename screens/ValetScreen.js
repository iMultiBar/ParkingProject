
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, Picker, ActionSheetIOS } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function ValetScreen() {
const [flag, setFlag ] = useState(false);
const [carNumber, setCarNumber] = useState(null)
const [userInfo, setUserInfo] = useState(null)
const [pNumber, setPNumber] = useState(null)
const [availablePP, setAvailablePP] = useState([]);

const [valetCars, setValetCars] = useState([])

const addCar = () =>{
  setFlag(!flag)
}
const back = () =>{
  setFlag(!flag)
  setUserInfo(null)
}

useEffect(() =>{
  let temp = []
  db.collection("requests").doc("valet").collection("valet").onSnapshot(querySnapshot =>{
    querySnapshot.forEach(doc =>{
      temp.push(doc.data())
    })
  })
  setValetCars(temp)
},[])


useEffect(() =>{
  let temp = []
  db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").
  collection("c-2").where("status","==","free").onSnapshot(querySnapshot =>{
    querySnapshot.forEach(doc =>{
      temp.push(doc.data())
    })
  })
  setAvailablePP(temp)
},[])

const check = async () =>{
  let temp = null
  let info = await db.collection("cars").where("registeredCars","array-contains",carNumber).get()
  info.forEach(doc =>{
    temp = doc.id
  })
  if(temp != null){
    let user = await db.collection("users").doc(temp).get()
    setUserInfo(user.data())
  }else{
    alert("car not found")
  }
}

const submit = async () =>{
  db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection("c-2").doc(pNumber).update({
    status: "taken"
  })
  db.collection("requests").doc("valet").collection("valet").add({
    parkingLocation: pNumber,
    ValetUid: firebase.auth().currentUser.uid,
    carPlate: carNumber,
    status: "parked"
  })
}
return (
      <View style={{flex:4}}>
      <Button title="add car" onPress={() =>addCar()} />
      {flag === false ?
      <ScrollView style={styles.container}>
        <Text>info</Text>

      {valetCars ? valetCars.map((n,i) => (
          <View key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.carPlate}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status}</Text>
        </View>
      )) : null}

      </ScrollView>
      :
      <ScrollView style={styles.container}>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setCarNumber}
          placeholder="Parking Location"
          value={carNumber}
        />
        
        <Button title="add car" onPress={() =>check()} />
        {userInfo === null ? 
        <Text>please add a car</Text>:
        <View>
            <Text>user name: {userInfo.displayName}</Text>
            <Text>user Phone: {userInfo.phone}</Text>
            <View style={{height : 0}}></View>
            <Picker
            text
              selectedValue={pNumber}
              mode="dialog"
              style={{height: 50, width: "100%"}}
              onValueChange={(itemValue, itemIndex) =>
              setPNumber(itemValue)
              }>
                {availablePP ? availablePP.map((n,i) =>
                  <Picker.Item key={i} label={"Parking number: "+n.parkingNumber} value={n.parkingNumber} />
                )
                  
                : null}
            </Picker>
            <Button title="Submit" onPress={() =>submit()} />
        </View>
        
        }
        
        <Button title="Go back" onPress={() =>back()} />
      </ScrollView>}
      
      </View>
  );
}

ValetScreen.navigationOptions = {
  title: 'Valet',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
