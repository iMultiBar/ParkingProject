//@refresh reset
import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker,View,Image } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

import moment from "moment"

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
        if(temp && temp != []){
            setReservation(temp.data())
            console.log("Fetching Reservation: ", temp.data())
        }

    }

    const EndRes = () => {
         db.collection("reservation").doc(firebase.auth().currentUser.uid).delete()
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
        let temp = []
        await db.collection('requests').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            temp.push(doc.id)
          });
        })
        .catch((err) => {
        });
        setServiceList(temp)
    }

    const ExtendRes = (res) => {
        var temp = res.endTime; 
        var status = moment(temp).add(5, 'hours').format('YYYY-MM-DD hh:mm:ss');
        db.collection("reservation")
        .doc(firebase.auth().currentUser.uid)
        .update({
            endTime:status
        });
    }

  return (
      user ? 
        <View style={styles.container}>
            <View style={{padding:15,flexDirection:"row"}}>
                {/*
                        
                */}
                   
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
            {/*
                
            */}
            <Divider style={{ backgroundColor: 'blue' }} />




            <ScrollView >

                {/* Request Service */}
                <Card title="Request Service">
                <Picker
                    selectedValue={selectedService}
                    style={{height: 50, width: "100%"}}
                    onValueChange={(itemValue, itemIndex) => setSelectedService({itemValue})}
                >
                            {

                                
                            serviceList && serviceList != undefined ? 
                                serviceList.map( (item, index) =>
                                        <Picker.Item key={index} label={item} value={item} />
                                )
                            :
                            null
                            }
                    </Picker>
                </Card>

                {/* User Parking Reservation List Tap */}
                <Card title="Reservation List">
                    <ScrollView>
                        { 
                        //  reservation ?
                        //     <View>
                        //         { reservation.map((item, index) => 
                        //                 <View key={index}>
                        //                     <Text> Parking Count: { 
                        //                         item.ParkingInfo.length
                        //                     } Start Time: {
                        //                         item.startTime 
                        //                     } End Time: { 
                        //                         item.endTime 
                        //                     }</Text>
                        //                     <Button onPress={() => ExtendRes(item)}/>
                        //                     <Button title="Cancel Reservation" onPress={() => EndRes()} />
                        //                 </View>
                        //         )}
                        //         <Button title="Reserve"/>
                        //     </View>
                           
                        //     :
                                <>
                                    <Text> Empty</Text>
                                    <Button title="Reserve" onPress={() => navigation.navigate('Map')} />
                                </>
                        }
                    </ScrollView>
                </Card>


                {/* // Your subscription Tap */}
                <Card title="Your subscription">
                        
                        {
                            subscription && subscription != undefined ?
                                <View>
                                    {/* <Text>subscription End Date: {subscription.endDate}</Text>
                                   <Text>subscription Level: {subscription.level} </Text> */}
                                   <Text>subscription Level: {subscription.type} </Text>
                                   <Text>Car wash Points: {subscription.carWashPoints} </Text>
                                   <Text>Valet Points: {subscription.valetPoints} </Text>
                                    <Button title="Extend"/>  
                                </View>
                            :
                                <>
                                    <Text>You are not Subscriped</Text>
                                    <Button title="Subscribe" />
                                </>
                        }
                </Card>

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
  },
});
