import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker, Button,View,TextInput } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

export default function reservation() {
    const [user , setUser] = useState(null)
    const [parking, setParking] = useState({Parking:"bla bla bla",code:5})
    const [carList , setCarList] = useState(null)
    const [selectedCar, setSelectedCar] = useState(null)
    const [netCar, setNetCar] = useState(null)
    
    useEffect(()=> {
        getInfo()
    },[])

    const getInfo = async () => {
        const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        console.log("fetching user:", User.data())
        setUser(User.data())


        const usersCars = await db.collection("cars").doc(firebase.auth().currentUser.uid).get()
        console.log("Fetching users Car List", usersCars.data())
        if(usersCars.data()){
            setCarList(usersCars.data())
        }
    }   

    const handleNewCar = async (carPlate) => {
        if(carList){
            let temp = {
                registeredCars:carList
            };
            temp.registeredCars.push(carPlate)
            console.log(carPlate, "=>", temp.registeredCars)
            db.collection("cars").doc(firebase.auth().currentUser.uid).set(
               temp
            )
            handleRes(carPlate)
        } else {
            console.log("registering new car Failed");
        }
    }   
    const handleRes = async (carPlate) => {
        console.log(carPlate, "=>", temp.registeredCars)
        const currentDate = new date()
        let temp = parking.code + currentDate + carPlate + ""
        db.collection("cars").doc(firebase.auth().currentUser.uid).collection("reservation").doc(temp).set({
                ParkingInfo: parking,
                CarInfo: carPlate,
                Date: currentDate
        })
    }


    return(
        
        <View style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
           <Text>Reservation Request</Text>
            <ScrollView>

                { 
                    user ?
                        <View>
                            <Picker
                            selectedValue={""}
                            style={{height: 50, width: 100}}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedCar(itemValue)
                            }>
                            { carList && carList !== undefined ? 
                                carList.map((item, index) => 
                                        <Picker.Item key={index} label={item} value={item}  />
                                )
                                : null
                            }
                                
                                <Picker.Item label={"New Car"} value={"new"}  />
                            
                            </Picker>

                            {selectedCar ?
                                <Button title="Reserve" onPress={() => handleRes(selectedCar)}/>
                            : selectedCar == "new" ?
                                <View>
                                    <TextInput placeholder="CarPlate" onChangeText={text => setNetCar(text)} />
                                    <Button title="Reserve" onPress={() => handleNewCar(newCar)}/>
                                </View>
                                :
                                null
                            }
                        </View>
                    
                    :
                        <View>
                            <Text> Empty</Text>
                            <Button title="Reserve"/>
                        </View>
                }
            </ScrollView>
        </View>
)

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
  });
  