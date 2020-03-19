import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";


export default function TestScreen() {
  const [parkingLocation, setParkingLocation] = useState();
  const [plat, setPlat] = useState();
  const [dateSubmit, setDateSubmit] = useState(null)

  const [currentDayLimit, setCurrentDayLimit] = useState(new Date());

  useEffect(() => {
    let currentDate = new Date()
    setCurrentDayLimit(currentDate.setDate(currentDate.getDate() + 5))
  }, []);

  useEffect(() => {
    setDateSubmit(moment(date).format('MM/DD/YY, hh:mm a'))
  }, [date]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

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

  const sendCleanRequest = async () =>{
    const requestClean = firebase.functions().httpsCallable("requestCarClean");
    const  res = await requestClean({parkingLocation, plat, dateSubmit})
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
      <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setPlat}
          placeholder="Car Plate"
          value={plat}
        />
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
        <Button onPress={() =>sendCleanRequest()} title="Send Clean Request!" />
    </ScrollView>
  );
}

TestScreen.navigationOptions = {
  title: 'Test',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
