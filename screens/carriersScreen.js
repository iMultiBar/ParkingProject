import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import ReactNativePickerModule from "react-native-picker-module"

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function carriersScreen() {
  let pickerRef = null;
  const [parkingLocation, setParkingLocation] = useState();
  const [plat, setPlat] = useState();
  const [dateSubmit, setDateSubmit] = useState(null)
  const [userCars, setUSerCars] = useState([])

  const [currentDayLimit, setCurrentDayLimit] = useState(new Date());

  useEffect(() => {
    let currentDate = new Date()
    setCurrentDayLimit(currentDate.setDate(currentDate.getDate() + 5))
  }, []);

  useEffect(() => {
    setDateSubmit(moment(date).format('MM/DD/YY, hh:mm a'))
  }, [date]);

  useEffect(() =>{
    loadCarNumbers()
  },[])

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const loadCarNumbers = async() =>{
    let load = await db.collection("cars").doc(firebase.auth().currentUser.uid).get()
    let cars = load.data()
    let plates = cars.registeredCars
    setUSerCars(plates)
  }

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const sendCarrierRequest = async () =>{
    db.collection("requests").doc("carrier").collection("carrierRequest").add({
      parkingLocation: parkingLocation,
      platNumber: plat,
      date: dateSubmit,
      status: false,
      carrierUid: null
    })
    Payments.pay("carrier request", 30, firebase.auth().currentUser.uid)
  }

  return (
    <ScrollView style={styles.container}>
      <Text>Parking location</Text>
      <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setParkingLocation}
          placeholder="Parking Location"
          value={parkingLocation}
        />
        <Text>Car Plat</Text>
        {Platform.OS === "ios"? 
          <>
          <TouchableOpacity
                  onPress={() => {pickerRef.show()}}
                  style={{height: 100, justifyContent: "center"}}
                >
            <Text>add you car number</Text>
                </TouchableOpacity>
                <ReactNativePickerModule
                  pickerRef={e => (pickerRef = e)}
                  selectedValue={plat}
                  title={'Select a plat'}
                  items={userCars}
                  style={{height: 50, width: "100%",}}
                  onCancel={() => {console.log("cancelled")}}
                  onValueChange={(itemValue, itemIndex) =>
                    setPlat(itemValue)
                  } 
                  />
        </>
              :
              <Picker
                selectedValue={plat}
                style={{ height: 50, width: '100%' }}
                onValueChange={(itemValue, itemIndex) => setPlat(itemValue)}
              >
                {userCars.map((n,i) =>{
                  <Picker.Item key={i} label={n[i]} value={n[i]} />
                })}
                
              </Picker>
        }
        <Text>Date and Time: {moment(date).format('MM/DD/YY, hh:mm a')}</Text>
        <View>
        <Button onPress={() =>showDatepicker()} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={() =>showTimepicker()} title="Show time picker!" />
      </View>
        <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            minimumDate= {new Date()}
            maximumDate= {currentDayLimit}
            is24Hour={false}
            display="default"
            onChange={onChange}
          />)}
        </View>
        <Button onPress={() =>sendCarrierRequest()} title="Send Clean Request!" />
    </ScrollView>
  );
}

carriersScreen.navigationOptions = {
  title: 'carriersScreen',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
