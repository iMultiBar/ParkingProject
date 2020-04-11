//@refresh reset
import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker,View,Image, ShadowPropTypesIOS } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

import moment from "moment"

import Cleaner from "./CleanerScreen"
import Valet from "./ValetScreen"
//react elements:
import { Card , Icon, Divider , Button, Avatar   } from 'react-native-elements';

//react animatable:
import * as Animatable from "react-native-animatable";


export default function UserScreen({ navigation }) {

    const [user , setUser] = useState(false)
    const [serviceList , setServiceList] = useState([])
    const [service , setService] = useState(false)
    const [selectedService , setSelectedService] = useState(null)
    const [reservation, setReservation] = useState(false)
    const [subscription, setSubscription] = useState(false)
    const [requestList,setRequestList] = useState(null)


    useEffect(()=>{
        GetUser()
        getServices()
    },[])
    //...............

    useEffect(() => {
       getResList()
    },[])

    const getResList = async () => {
        console.log("god save the queen")
        let temp = []
        temp = await db.collection("reservation").doc(firebase.auth().currentUser.uid).get()
        if(temp.data()){
            setReservation(temp.data())
            console.log("Fetching Reservation: ", temp.data())
        }

    }

    const EndRes = () => {
         db.collection("reservation").doc(firebase.auth().currentUser.uid).delete()
         getResList()
    }

    const GetUser = async () => {
        const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        setUser(User.data())
        const Sub = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
        if(Sub.data()){
            setSubscription(Sub.data());
        }
    }

    const getServices = async ()  => {
        let serv = []
        const info = await db.collection('requests').get()
        info.forEach(doc => {
            console.log("Please",doc.id)
            serv.push(doc.id)
        })

        // let temp = [];
        // if(user.role == "valet"){
        //     const info = await db.collection('requests').doc("valet").collection("valet").get()
        //     info.forEach(doc => {
        //         console.log("Please",doc.id)
        //         temp.push({id = doc.id,  ...doc.data()})
        //     })
        //     setRequestList(temp)
        // } else if(user.role == "cleaner"){
        //     const info = await db.collection('requests').doc("clean").collection("cleanRequest").get()
        //     info.forEach(doc => {
        //         console.log("Please",doc.id)
        //         temp.push({id = doc.id,  ...doc.data()})
        //     })
        //     setRequestList(temp)
        // } else if(user.role == "carrier"){
        //     const info = await db.collection('requests').doc("carrier").collection("carrierRequest").get()
        //     info.forEach(doc => {
        //         console.log("Please",doc.id)
        //         temp.push({id = doc.id,  ...doc.data()})
        //     })
        //     setRequestList(temp)
        // }

        setServiceList(serv)
    }

    const ExtendRes = (res) => {
        var temp = reservation.endTime; 
        var status = moment(temp).add(5, 'hours').format('YYYY-MM-DD hh:mm:ss');
        db.collection("reservation")
        .doc(firebase.auth().currentUser.uid)
        .update({
            endTime:status
        });
        getResList()
    }

  return (
      user ? 
        <View style={styles.container}>
            <View style={{padding:15,flexDirection:"row"}}>
                   
                <View style={{ alignSelf:"flex-start",flexDirection:"row",marginRight:"60%"}}>
                    <Avatar
                        rounded
                        source={{ uri: firebase.auth().currentUser.photoURL  }}
                    />
                    <Text style={{padding:8}}>{user.displayName}</Text>
                </View>
                <Button
                icon={
                        <Icon
                        name='settings-helper'
                        type='material-community'
                        color='#517fa4'
                    />
                }
                onPress={() => navigation.navigate('Settings')}
                type="clear"
                />

       
            </View>

            <Divider style={{ backgroundColor: 'blue' }} />




            <ScrollView >

                {/* Request Service */}
                <Card title="Request Service">
                <Picker
                    selectedValue={selectedService}
                    style={{height: 50, width: "100%"}}
                    onValueChange={(itemValue, itemIndex) => setSelectedService(itemValue)}
                >
                    <Picker.Item label={"Select Service..."} value={""} />
                            {
                            serviceList ? 
                                serviceList.map( (item, index) =>
                                        <Picker.Item key={index} label={item} value={item} />
                                )
                            :
                            null
                            }
                    </Picker>
                    <Button title="Request Page" onPress={() => navigation.navigate(''+selectedService)} />
                </Card>

                {/* User Parking Reservation List Tap */}
                <Card title="Reservation">
                    <ScrollView>
                        { 
                            reservation ? 
                                <View>
                                    <Text>Parkings Information:</Text>
                                    <ScrollView>
                                    {  
                                        reservation.ParkingInfo.map((item,index) => 
                                            <View key={index}>
                                                <Card>
                                                <Text>  Car Plate: { item.carPlate}</Text>
                                                <Text>  Latitude: { item.latitude }</Text>
                                                <Text>  Longitude: { item.longitude }</Text>
                                                </Card>
                                            </View>
                                        )
                                    }
                                    </ScrollView>
                                    <Text style={{paddingTop:10}}>Start Time: {reservation.startTime}</Text>
                                    <Text> End Time: {reservation.endTime}</Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                                        <Button title="Extend" buttonStyle={{flex:1}} onPress={() => ExtendRes()} />
                                        <Button title="Cancel" buttonStyle={{flex:1,backgroundColor:"red"}} onPress={() => EndRes()} />
                                    </View>
                                    <Button title="View History" onPress={() => navigation.navigate('History')} />
                                 </View>
                                
                                :<>
                                    <Text style={{padding:10}}> There is No Reservation </Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                        <Button buttonStyle={{width:170}} title="Reserve" onPress={() => navigation.navigate('Map')} />
                                        <Button buttonStyle={{width:170}} title="View History" onPress={() => navigation.navigate('History')} />
                                    </View>
                                </>
                        }
                    </ScrollView>
                </Card>


                {/* // Your subscription Tap */}
                <Card title="subscription Details">
                {
                            subscription ?
                                <View>
                                   <Text>subscription Level: {subscription.type} </Text>
                                   <Text>Car wash Points: {subscription.carWashPoints} </Text>
                                   <Text>Valet Points: {subscription.valetPoints} </Text>
                                    <Button title="Extend"/>  
                                </View>
                            :
                                <>
                                    <Text>You are not Subscriped</Text>
                                    <Button onPress={() => navigation.navigate("subscription")} title="Subscribe" />
                                </>
                        }
                </Card>

    
                        
                {/* // Your Carrier View Tap */}
                { user.role == "carriar" ?
                <Card title="Carriar Manager">
                        <Text>Soon ;></Text>
                </Card>
                :null
                }
                { user.role == "cleaner" ?
                <Card title="Cleaner Manager">
                    <Cleaner />
                </Card>
                :null
                }
                { user.role == "valet" ?
                <Card title="Valet Manager">
                        <Valet />
                </Card>
                :null
                }
                
            </ScrollView>
        </View> 
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
  );
}

UserScreen.navigationOptions = {
  title: 'User Screen',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    paddingBottom:1
  },
});
