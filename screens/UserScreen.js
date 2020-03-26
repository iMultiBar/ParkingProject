import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker, Button,View } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

export default function UserScreen() {
    const [user , setUser] = useState(false)
    const [serviceList , setServiceList] = useState([])
    const [service , setService] = useState(false)
    const [reservation, setReservation] = useState([])
    const [subscription, setSubscription] = useState(false)



    useEffect(()=>{
        GetUser()
        getServices()
    },[])
    
    useEffect(() => {
        let temp = []
        if(user){
            db.collection("reservation").doc(firebase.auth().currentUser.uid).onSnapshot(snapShot => {
                    temp.push(snapShot.data())
                    console.log("fetching reservation data", snapShot.data())
                }
            )
            if(temp && temp != []){
                setReservation(temp)
                console.log("reservation:", temp)
            }
        }
    },[])
    const GetUser = async () => {
        const User =await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        setUser(User.data())
        const Sub = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
        console.log(Sub.data())
        if(Sub.data()){
            setSubscription(Sub.data());
        }
    }
    const getServices = () => {
        let temp = []
        db.collection('services').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            temp.push(doc.id)
          });
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
        setServiceList(temp)
        
    }
  return (
      user ? 
        <View style={styles.container}>
                {/* <img source={{ uri:`${user.photoURL}`} }/> */}
                <Text>{user.displayName}</Text>
            <ScrollView >

                {/* // User Service Tab */}
                <View style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
                    <Text>Request Service</Text>
                    <Picker
                        selectedValue={""}
                        style={{height: 50, width: 100}}
                        onValueChange={(itemValue, itemIndex) =>
                            setService(itemValue)
                        }>
                            {
                            serviceList ? 
                                serviceList.map( (item, index) =>
                                        <Picker.Item key={index} label={item} value={item} />
                                    )
                            :
                               null
                            }
                    </Picker>
                </View>


                 {/* User Parking Reservation List Tap */}
                <View style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
                    <Text>Reservation List</Text>
                    <ScrollView>

                        { 
                         reservation ?
                         
                            <View>
                                {reservation.map((item, index) => 
                                        <View key={index}>
                                            <Text> Parking Location: { item.parking.location } Start Time: {item.startTime } End Time: { item.endTime }</Text>
                                        </View>
                                )}
                                <Button title="Reserve"/>
                            </View>
                           
                            :
                                <>
                                    <Text> Empty</Text>
                                    <Button title="Reserve"/>
                                </>
                        }
                    </ScrollView>
                </View>


                {/* // Your subscription Tap */}
                <View style={{borderColor:"black",borderWidth:3,borderStyle:"solid", marginBottom:20,padding:5}}>
                        <Text>Your subscription</Text>
                        {
                            subscription ?
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
                                    <Button title="Subscripe" />
                                </>
                        }
                </View>

            </ScrollView>
        </View> 
    :
    <Text>Loadiing...</Text>
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
