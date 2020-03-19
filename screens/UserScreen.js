import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker, Button,View } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

export default function UserScreen() {
    const [user , setUser] = useState(false)
    const [serviceList , setServiceList] = useState(false)
    const [service , setService] = useState(false)
    const [reservation, setReservation] = useState(false)
    const [subscription, setSubscription] = useState(false)


    useEffect(() => {
        temp = []
        db.collection("reservation").doc(user.id).onSnapshot(snapShot => {
                temp.push(snapShot.data())
                console.log("fetching reservation data", snapShot.data())
            }
        )
        setReservation(temp)
    },[])

    useEffect(()=>{
        GetUser()
        
    },[])
    const GetUser = async () => {
        const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        setUser(User)
    }
  return (
      user ? 
        <View>
                <img source={{uri:`${user.photoURL}`}}/>
                <Text>{user.displayName}</Text>
            <ScrollView style={styles.container}>

                // User Service Tab
                <View>
                    <Text>Request Service</Text>
                    <Picker
                        selectedValue={""}
                        style={{height: 50, width: 100}}
                        onValueChange={(itemValue, itemIndex) =>
                            setService(itemValue)
                        }>
                            {
                            serviceList ? 
                                serviceList.map( item =>
                                        <Picker.Item label={item} value={item} />
                                    )
                            :
                                <Text>A7tm 7alk</Text>
                            }
                    </Picker>
                </View>


                // User Parking Reservation List Tap
                <View>
                    <Text>Reservation List</Text>
                    <ScrollView>
                        { reservation ?
                            <View>
                                {reservation.map((item, index) => 
                                
                                        <Text>Parking Location: {item.parking.location} Start Time: {item.startTime} End Time: {item.endTime}</Text>
                                
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


                // Your subscription Tap
                <View>
                        <Text>Your subscription</Text>
                        {
                            subscription ?
                                <View>
                                    <Text>subscription End Date: {subscription.endDate}</Text>
                                    <Text>subscription Level: {subscription.level} </Text>
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
