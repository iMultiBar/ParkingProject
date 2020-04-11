import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextInput, Button, View, Alert, TouchableOpacity } from 'react-native';
import moment from "moment";
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import ReactNativePickerModule from "react-native-picker-module"

export default function TestScreen() {
  let pickerRef = null;
  const [parkingLocation, setParkingLocation] = useState(); // this react hook useState created so the user can input the car location
  const [plat, setPlat] = useState();// this react hook useState created so the user can input the car plate number
  const [dateSubmit, setDateSubmit] = useState(null)// this react hook useState used to submit the date and time of the user current time.
  const [currentFreePoints, setCurrentFreePoints] = useState(null);// this useState will store the current free points for washig car in the user account.

  const [currentDayLimit, setCurrentDayLimit] = useState(new Date());// this react hook useState get the current date and time to set a limt of 5 days to request cleaner.

  const [userCars, setUSerCars] = useState([])
  // this this react hook useEffect loads after everything loaded which is going to set the (currentDayLimit) to 5 days ahead. so no user can request in a period of a week.
  // and it will call the check function which is explained in line 43.
  useEffect(() => {
    let currentDate = new Date()
    setCurrentDayLimit(currentDate.setDate(currentDate.getDate() + 5))
    check()
    loadCarNumbers()
  }, []);

  // this this react hook useEffect loads after everything loaded which get the user date and time input and store it in (DateSubmit) this useEffect loads every time that (date) useState get new data.
  useEffect(() => {
    setDateSubmit(moment(date).format('MM/DD/YY, hh:mm a'))
  }, [date]);

  const loadCarNumbers = async() =>{
    let load = await db.collection("cars").doc(firebase.auth().currentUser.uid).get()
    let cars = load.data()
    let plates = cars.registerdCars
    setUSerCars(plates)
  }


  const [date, setDate] = useState(new Date()); // this react hook useState store the current date
  const [mode, setMode] = useState('date');// this react hook useState set the mode of the date and time Picker to switch between them.
  const [show, setShow] = useState(false);// this react hook useState set the show to ture when the user click on one of the option

  // evertime that user change the date or the time this function will be used so it can updated the inputs infromation.
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  //this function will set CurrentFreePoints from the database value called carWashPoints. which it will be used to pay with it later.
  // i wrote an await so the code dose not go all the way though the fucntion and setCurrentFreePoints to null or give a crash
  const check = async () =>{
    db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").onSnapshot(querySnapshot =>{
      let temp = 0
      querySnapshot.forEach(doc =>{
        if(doc.id === "sub"){
          let info = doc.data()
          temp = info.carWashPoints
        }
      })
      setCurrentFreePoints(temp)
    })
    
  }
  

  // this function manages the mode between the time and date.
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  // each time the user click on Date it will change the mode to Date
  const showDatepicker = () => {
    showMode('date');
  };

  // each time the user click on Date it will change the mode to Time
  const showTimepicker = () => {
    showMode('time');
  };

  // this function will decide and send the clean request. 
  // the function will receive an argument called check which it will be eather true or false.
  // which will be used in the if statement.

  // the if statement will handle the request that user press on yes button and if the user have more than 1 point to do the action
  // the action will cut a point from his subscription by updateing the value in the database.
  // after that it will call a serverless function called (requestCarClean) which from it it will add the request in the database.

  // the else if will handle if the user clicked yes without haveing point in his account.

  // the else will handle the request without haveing a point. like from his money.

  // one each query i added await so the request clean waits for the data to come back to complete the promise
  const sendCleanRequest = async (check) =>{
    if(check === true && currentFreePoints > 0){
      let c = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").update({carWashPoints: currentFreePoints-1})
      const requestClean = firebase.functions().httpsCallable("requestCarClean");
      const  res = await requestClean({parkingLocation, plat, dateSubmit})
    }else if(check === true && (currentFreePoints <= 0 || currentFreePoints === null)){
      alert("you don't have enough points")
    }else{
      const requestClean = firebase.functions().httpsCallable("requestCarClean");
      const  res = await requestClean({parkingLocation, plat, dateSubmit})
    }
  }


  // i created this function because users have subscriptions, 
  // so this function will pop-up an alert to ask the user eather use 
  // or not use the point. also the function have cancel to go back before submit.
  // -----------------------
  // alert function uses first property to display the title, second to display the massage
  // third it will take the button, in my case i used an arry to display three buttons which is
  // yes for useing the point, no to not useing it, and cancelto go back.
  // in each yes and no buttons i called another function which from it i will do the action.
  // provided with (true as an argument for yes) an (false us an argument for false).
  const check2 = () =>{
    Alert.alert(
      'Car wash point',
      'Do you want to use your point to wash your car ?',
      [
        { text: 'Yes', onPress: () => sendCleanRequest(true) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'No', onPress: () => sendCleanRequest(false) },
      ],
      { cancelable: false }
    );
  }

  const kill = () =>{
    setPlat("")
  }

  return (
    <ScrollView style={styles.container}>
      <Text>Parking location</Text>
      {/* this reacte native component let the user input the information and store in (parkingLocation)  */}
      <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={setParkingLocation}
          placeholder="Parking Location"
          value={parkingLocation}
        />
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
        {plat ? <View>
          <Text>You choosed: {plat}</Text>
          <Button onPress={() =>kill()} title="delete" />
        </View> : null}
        
        <Text>Date and Time: {moment(date).format('MM/DD/YY, hh:mm a')}</Text>
        {currentFreePoints > 0 ? <Text>You have: {currentFreePoints} free points</Text> : <Text>Sadly you have no points</Text>}
        
        <View>

        <Button onPress={() =>showDatepicker()} title="Show date picker!" />
      </View>
      <View>

        <Button onPress={() =>showTimepicker()} title="Show time picker!" />
      </View>
        <View>
        {show && (
          // this react native component displays the date and time to the users which from it the user can pick by scrolling.
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
        {/* this button triggers the functions which is explained apove */}
        <Button onPress={() =>check2()} title="Send Clean Request!" />
    </ScrollView>
  );
}

// this object which controls the headder.
TestScreen.navigationOptions = {
  title: 'RequestCleaner',
};

// this const uses to save the style and use it on the react native component which determines the look of the page. 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
