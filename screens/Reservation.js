import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker,View,TextInput } from 'react-native';
import db from '../db';

import DateTimePicker from '@react-native-community/datetimepicker';
import SectionedMultiSelect from "react-native-sectioned-multi-select"

import moment from "moment"

//react elements:
import { Card , Icon, Divider , Button ,Overlay   } from 'react-native-elements';

//react animatable:
import * as Animatable from "react-native-animatable";


import firebase from "firebase/app";
import "firebase/auth";

export default function reservation(props) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [show, setShow] = useState(false);
    const [DateSubmit, setDateSubmit] = useState(false);
    const [carArr , setCarArr] = useState([])
    const [user , setUser] = useState(null)
    const [parking, setParking] = useState({Parking:"bla bla bla",code:5})
    const [carList , setCarList] = useState([])
    const [newCar, setNewCar] = useState(null)
    const [selectedCar, setSelectedCar] = useState([])
    const [reButton, setReButton] = useState(true);


    useEffect(()=>{},[selectedCar])


    const parkings = props.navigation.getParam('chosen','did not find the param');
    console.log('parkings in reservation page',parkings);

    const AndroidShowDateTime = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    useEffect(() => {
        setDateSubmit(moment(date).format('YYYY-MM-DD hh:mm:ss'))
        console.log(DateSubmit)
    }, [date]);
    
    useEffect(()=> {
        console.log("PARKINGGGGGG", parkings)
        getInfo()
    },[])
    useEffect(()=> {
        console.log("Setting Car List")
        let temp = []
        for(let i =0;i<carList.length;i++){
            temp.push({id:i, name: carList[i]})
        }
        setCarArr(temp)
        console.log("Help me daddy",carArr)
    },[carList])
    // useEffect(() => {
    //     db.collection("cars").doc(firebase.auth().currentUser.uid).onSnapshot((snapShot) => 
        
    //     )
    // },[])

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
      
    const getInfo = async () => {
        const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        console.log("fetching user:", User.data())
        setUser(User.data())


        const usersCars = await db.collection("cars").doc(firebase.auth().currentUser.uid).get()
        console.log("Fetching users Car List", usersCars.data())
        if(usersCars.data()){
            let cars = usersCars.data()
            setCarList(cars.registerdCars)
            handlePicker(cars.registerdCars)
        }
    }   

    const handlePicker = (l) => {
        console.log("Setting Car List",l)
        let temp = []
        for(let i =0;i<carList.length;i++){
            temp.push({id:i, CarPlate: l[i]})
        }
        setCarArr(temp)
        console.log("Help me daddy",carArr)
    }
    const handleNewCar = async (carPlate) => {
        if(carList){
            let temp = carList

            if(carPlate){
                temp.push(carPlate)
                console.log(carPlate, "=>", temp)
                await db.collection("cars").doc(firebase.auth().currentUser.uid).set({
                    registerdCars:temp
                })
            } else {
                console.log("Wrong input")
            }
            getInfo()
        } else {
            console.log("registering new car Failed");
        }
        
    }   
    const handleRes = async () => {
        let startTime = moment(date).format('YYYY-MM-DD hh:mm:ss');
        let endTime = moment(startTime).add(5, 'hours').format('YYYY-MM-DD hh:mm:ss');
  
        if(parkings.length == selectedCar.length && parkings && selectedCar){
            let tempParking = []
            for(let num = 0; num < parkings.length;num++){
                tempParking.push({
                    carPlate : carList[selectedCar[num]],
                    id : parkings[num].id,
                    latitude:  parkings[num].latitude,
                    longitude:  parkings[num].longitude
                })
            }
    
            // for(let num = 0; num<parking.length;num++){
            //     db.collection("parking").doc("yq4MTqaC4xMaAf9HArZp").collection("c-2").doc(tempParking[num].id).update({
            //         carPlate : carList[selectedCar[num]],
            //         status : "taken"
            //     })
            // }
            db.collection("reservation").doc(firebase.auth().currentUser.uid).set({
                    ParkingInfo: tempParking,
                    startTime,
                    endTime
            })
        }


    }

    const onSelectedItemsChange = async (selectedItems) => {
        await setSelectedCar( selectedItems );
      };
    return(
        
    
            <ScrollView>

                { 
                    user ?
                    <Card title="Parking Reservation">

                            <View>
                                {Platform.OS === 'ios' ?
                                <DateTimePicker
                                        testID="dateTimePicker"
                                        timeZoneOffsetInMinutes={0}
                                        value={date}
                                        mode={"datetime"}
                                        is24Hour={false}
                                        display="default"
                                        onChange={onChange}
                                        />
                                   :
                                   <View>
                                       <Button title="Select Date" onPress={() => AndroidShowDateTime("date")}/>
                                       <Button title="Select Time" onPress={() => AndroidShowDateTime("time")}/>

                                        {show && (
                                                // this react native component displays the date and time to the users which from it the user can pick by scrolling.
                                                <DateTimePicker
                                                
                                                    testID="dateTimePicker"
                                                    value={date}
                                                    mode={mode}
                                                    minimumDate= {new Date()}
                                                    //maximumDate= {currentDayLimit}
                                                    is24Hour={false}
                                                    display="default"
                                                    onChange={onChange}
                                                />)}
                                        
                                             </View>
                                   }
                            </View>
                            { parkings.map((item,index) =>    
                                <View key={index}>
                                    <Text>Parking Code: {item.id}</Text>
                                </View>
                            )}
                            {carList && carList !== undefined ? 
                            <SectionedMultiSelect
                            items={carArr}
                            uniqueKey="id"
                            hideSearch={true}
                            selectText="Chose Registered Cars.."
                            onSelectedItemsChange={onSelectedItemsChange}
                            selectedItems={selectedCar}
                        />
                        :null} 
                        {   carList && carList[0] != null ?
                                parkings && parkings[0] != null ?
                                    parkings.length == selectedCar.length ?
                                        <Button title="Reserve"  buttonStyle={{backgroundColor:"darkred"}} onPress={()=> handleRes()} />
                                    : <Button title="Reserve" disabled buttonStyle={{backgroundColor:"darkred"}}  />
                                : <Button title="Reserve" disabled buttonStyle={{backgroundColor:"darkred"}}  />
                            : <Button title="Reserve" disabled buttonStyle={{backgroundColor:"darkred"}}  />
                        }       

                    </Card>
                
                    :
                    <View style={{flex:1,paddingTop:15,justifyContent:"center",alignSelf:"center"}}>
                        
                        <Animatable.Text animation="slideInDown" iterationCount={5} direction="alternate">Loading...</Animatable.Text>
                        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>
                        <Button
                            title="Loading button"
                            loading 
                            type="clear"
                        />
                        </Animatable.View>
                    </View>
                }
                <Card >
                <View>
                                        <TextInput placeholder="CarPlate" keyboardType={'numeric'} onChangeText={text => setNewCar(text)} />
                                        <Button title="Add Car" onPress={() => handleNewCar(newCar)}/>
                                    </View>
                </Card>
            </ScrollView>
)

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
  });
  