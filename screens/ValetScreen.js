import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, Picker, ActionSheetIOS, TouchableOpacity } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card, Input } from "react-native-elements";
import ReactNativePickerModule from "react-native-picker-module"
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function ValetScreen() {
let pickerRef = null;
const [flag, setFlag ] = useState(false);
const [carNumber, setCarNumber] = useState(null)
const [userInfo, setUserInfo] = useState(null)
const [pNumber, setPNumber] = useState(null)
const [availablePP, setAvailablePP] = useState([]);
const [parkingnNumber1, setParkingNumber1] = useState([])
const [valetCars, setValetCars] = useState([])

const addCar = () =>{
  setFlag(!flag)
  setUserInfo(null)

}

const getCars = () =>{
  
  db.collection("requests").doc("valet").collection("valet").orderBy("status").onSnapshot(querySnapshot =>{
    const valetCars = [];
    querySnapshot.forEach(doc =>{
      let info = doc.data()
      if(info.status != "done"){
        valetCars.push({id: doc.id, ...doc.data()})
      }
        
    })
    console.log(valetCars)
    setValetCars([...valetCars])
  })
  
}
const getAvailableParkings = async() =>{
  db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").
  collection("c-2").where("status","==","free").onSnapshot(querySnapshot =>{
    let temp = []
    let temp2 = []
    querySnapshot.forEach(doc =>{
      let info = doc.data()
      temp.push(info.parkingNumber)
      temp2.push(info)
    })
    setParkingNumber1(temp)
    setAvailablePP(temp2)
  })
  
}


useEffect(() =>{
  getCars()
  getAvailableParkings()
},[])



const check = async () =>{
  let temp = null
  let info = await db.collection("cars").where("registeredCars","array-contains",carNumber).get()
  info.forEach(doc =>{
    temp = doc.id
  })
  if(temp != null){
    let user = await db.collection("users").doc(temp).get()
    console.log("user: ", user.data())
    setUserInfo({id: user.id, ...user.data()})
  }else{
    alert("car not found")
  }
  console.log("number: ", parkingnNumber)
}

const submit = () =>{
  db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection("c-2").doc(pNumber).update({
    status: "taken"
  })
  db.collection("requests").doc("valet").collection("valet").add({
    parkingLocation: pNumber,
    ValetUid: firebase.auth().currentUser.uid,
    carPlate: carNumber,
    status: "parked",
    userId: userInfo.id
  })
}

const retrunCar = async (n)=>{
  db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection("c-2").doc(n.parkingLocation).update({
    status: "free"
  })
 db.collection("requests").doc("valet").collection("valet").doc(n.id).update({
    status: "done",
    doneBy: firebase.auth().currentUser.uid
  })
}

return (
      <View style={{flex:4}}>
        {flag === false ? <Button title="add Car" onPress={() =>addCar()} /> : <Button title="Go back" onPress={() =>addCar()} />}
      
      {flag ? 
      <ScrollView style={styles.container}>
      <Input
        onChangeText={setCarNumber}
        placeholder="enter car number"
        value={carNumber}
      />
      
      <Button title="add car" onPress={() =>check()} />
      {userInfo === null ? 
      <Text>please add a car</Text>:
      <View>
          <Text>user name: {userInfo.displayName}</Text>
          <Text>user Phone: {userInfo.phone}</Text>
          <View style={{height : 0}}></View>
          {Platform.OS === "ios"? 
          <>
            <TouchableOpacity
                    onPress={() => {pickerRef.show()}}
                  >
              <Text>Add Parking spot</Text>
                  </TouchableOpacity>
                  <ReactNativePickerModule
                    pickerRef={e => (pickerRef = e)}
                    selectedValue={pNumber}
                    title={'Select a parking'}
                    items={parkingnNumber1}
                    style={{height: 50, width: "100%",}}
                    onCancel={() => {console.log("cancelled")}}
                    onValueChange={(itemValue, itemIndex) =>
                      setPNumber(itemValue)
                    } 
                    />
          </>
                :
                <Picker
                  selectedValue={pNumber}
                  style={{ height: 50, width: '100%' }}
                  onValueChange={(itemValue, itemIndex) => setPNumber(itemValue)}
                >
                  {availablePP.map((n,i) =>
                    <Picker.Item key={i} label={"Parking :"+n.parkingNumber} value={n.parkingNumber} />
                  )}
                </Picker>
          }
          <Button title="Submit" onPress={() =>submit()} />
      </View>
      
      }
    </ScrollView>
      :
      <ScrollView style={styles.container}>

      { valetCars.map((n,i) => (
          <Card key={i} style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
          <Text><Text style={{ fontWeight: 'bold' }}>parking location</Text>: {n.parkingLocation}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>plat number</Text>: {n.carPlate}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Status</Text>: {n.status}</Text>
          {n.status === "requested" ? <Button title="retrun car" onPress={() =>retrunCar(n)} />: null}
        </Card>
      )) }

      </ScrollView>
      
      }
      
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