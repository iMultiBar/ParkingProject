import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";

import { MaterialIcons } from "@expo/vector-icons";

import { Button, Text } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import * as Animatable from "react-native-animatable";


const TestScreen = props => {
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

  const sendCleanRequest = async () => {
    const requestClean = firebase.functions().httpsCallable("requestCarClean");
    const res = await requestClean({ parkingLocation, plat, dateSubmit })
    alert("Your clean request has been received");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row", marginLeft: 20 }}>
        <View>
          <SocialIcon
            type='foursquare'
          />
        </View>

        <View>
          <Text style={{ fontSize: 25, fontFamily: "serif", textAlign: "center", marginBottom: 15, color: "blue", fontWeight: "bold", marginTop: 10 }}>SEND CLEAN REQUEST</Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}></View>

      <Text>Parking location</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setParkingLocation}
        placeholder="Parking Location"
        value={parkingLocation}
      />
      <Text>Car Plate</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={setPlat}
        placeholder="Car Plate"
        value={plat}
      />
      <Text>Date and Time: {moment(date).format('MM/DD/YY, hh:mm a')}</Text>

      <View style={{ marginTop: 10 }}></View>

      <View>
        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
          <Button
            icon={
              <MaterialIcons
                name="date-range"
                color="white"
                size={15}
              />
            }
            title=" SHOW DATE PICKER!"
            onPress={showDatepicker}
          />
        </Animatable.View>
      </View>

      <View style={{ marginTop: 10 }}></View>


      <View>
        <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
          <Button
            icon={
              <MaterialIcons
                name="access-time"
                color="white"
                size={15}
              />
            }
            title=" SHOW TIME PICKER!"
            onPress={showTimepicker}
          />
        </Animatable.View>
      </View>

      <View style={{ marginTop: 10 }}></View>

      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            minimumDate={new Date()}
            maximumDate={currentDayLimit}
            is24Hour={false}
            display="default"
            onChange={onChange}
          />)}
      </View>

      <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
        <Button
          icon={
            <MaterialIcons
              name="send"
              color="white"
              size={15}
            />
          }
          title=" SEND CLEAN REQUEST!"
          onPress={sendCleanRequest}
        />
      </Animatable.View>

      <View style={{ marginTop: 10 }}></View>

      <Animatable.View animation="pulse" iterationCount="infinite" direction="alternate">
        <Button
          icon={
            <MaterialIcons
              name="send"
              color="white"
              size={15}
            />
          }
          title=" VISIT CLEANER SCREEN"
          onPress={() => props.navigation.navigate("CleanerStack")}
        />
      </Animatable.View>


    </ScrollView>
  );
}

TestScreen.navigationOptions = {
  header: null
};

// TestScreen.navigationOptions = {
//   title: 'Test',
// };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default TestScreen;
