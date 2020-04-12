import React, { useState, useEffect } from "react";
import { View, Text, Picker } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import Payments from "./Payments"
import db from "../db";

import { Button } from "react-native-elements"


   export default function SubscriptionScreen() {
     const [subscription, setSubscription] = useState(null)
     const [userSub, setUserSub] = useState([]);
     const [flag, setFlag] = useState(false);
     
    useEffect(()=> {
        GetInfo()
    },[])

    const GetInfo = async () => {
        let check = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").get()
        if(check.data()){
        setFlag(true)
        setUserSub(check.data())
    }
    } 
    const handleSubscription = () => {
        if(subscription === "bronze"){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "bronze",
            carWashPoints: 1,
            valetPoints: 2,
          })
          Payments.pay("bronze subscription", 30, firebase.auth().currentUser.uid)
        }else if(subscription === "silver"){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "silver",
            carWashPoints: 2,
            valetPoints: 4,
          })
          Payments.pay("silver subscription", 50, firebase.auth().currentUser.uid)
        }else if(subscription === "gold"){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "gold",
            carWashPoints: 3,
            valetPoints: 6,
          })
          Payments.pay("gold subscription", 80, firebase.auth().currentUser.uid)
        }
        
      };
   return(
            flag == false ? <View>
                <Text>
                    Subscription 
                </Text>
                <View>
                <Picker
                selectedValue={subscription}
                style={{height: 50, width: "100%"}}
                onValueChange={(itemValue, itemIndex) =>
                    setSubscription(itemValue)
                }>
                    <Picker.Item label="Select a Department" value="" />
                    <Picker.Item label="Bronze Price:15" value="bronze" />
                    <Picker.Item label="Silver Price:30" value="silver" />
                    <Picker.Item label="Gold Price:50" value="gold" />
                </Picker>
                </View>
                    <Button title="subscribe and pay" onPress={handleSubscription}/>
                </View>
                : 
                <View>
                    <Text>Car Wash Point: {userSub.carWashPoints}</Text>
                    <Text>Type: {userSub.type}</Text>
                    <Text>Valet Point: {userSub.valetPoints}</Text>
                </View>
                    
   )
}