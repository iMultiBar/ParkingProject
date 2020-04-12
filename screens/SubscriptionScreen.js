import React, { useState, useEffect } from "react";
import { View, Text, Picker, TouchableOpacity } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import Payments from "./Payments"
import db from "../db";
import ReactNativePickerModule from "react-native-picker-module"
import { Button } from "react-native-elements"
import { Card, Input } from "react-native-elements";

   export default function SubscriptionScreen() {
    let pickerRef = null;
     const [subscription, setSubscription] = useState(null)
     const [userSub, setUserSub] = useState([]);
     const [flag, setFlag] = useState(false);
     const [details, setDetails] = useState([]);
     
    useEffect(()=> {
        GetInfo()
    },[])

    useEffect(()=>{
      if(subscription === "bronze" ||subscription === 0){
        let temp = ["bronze",
        1,
        2,]
        setDetails(temp)
      }if(subscription === "silver" ||subscription === 1){
        let temp = [
          "silver",
          2,
          4,
        ]
        setDetails(temp)
      }if(subscription === "gold"||subscription === 2){
        let temp = [
          "gold",
          3,
          6,
        ]
        setDetails(temp)
      }
    },[subscription])


    const GetInfo = async () => {
      db.collection("users").doc(firebase.auth().currentUser.uid).
      collection("subscription").onSnapshot(querySnapshot =>{
        const userSub = []
        querySnapshot.forEach(doc =>{
          userSub.push(doc.data)
        })
        setUserSub([...userSub])
      })
    } 

    const handleSubscription = () => {
        if(subscription === "bronze" ||subscription === 0){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "bronze",
            carWashPoints: 1,
            valetPoints: 2,
          })
          Payments.pay("bronze subscription", 30, firebase.auth().currentUser.uid)
        }else if(subscription === "silver"||subscription === 1){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "silver",
            carWashPoints: 2,
            valetPoints: 4,
          })
          Payments.pay("silver subscription", 50, firebase.auth().currentUser.uid)
        }else if(subscription === "gold"||subscription === 2){
          db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").doc("sub").set({
            type: "gold",
            carWashPoints: 3,
            valetPoints: 6,
          })
          Payments.pay("gold subscription", 80, firebase.auth().currentUser.uid)
        }
        GetInfo();
      };
   return(
            flag == false ? <Card>
                <Text>
                    Subscription 
                </Text>
                <Card>
                {Platform.OS === "ios"? 
                <>
                  <TouchableOpacity
                          onPress={() => {pickerRef.show()}}
                        >
                    <Text>Select subscription type</Text>
                        </TouchableOpacity>
                        <ReactNativePickerModule
                          pickerRef={e => (pickerRef = e)}
                          selectedValue={subscription}
                          title={'Select a unit'}
                          items={["bronze", "silver","gold"]}
                          style={{height: 50, width: "100%",}}
                          onCancel={() => {console.log("cancelled")}}
                          onValueChange={(itemValue, itemIndex) =>
                            setSubscription(itemIndex)
                          } 
                          />
                </>
                      :
                      <Picker
                        selectedValue={subscription}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setSubscription(itemValue)}
                      >
                        <Picker.Item label="Bronze Price:15" value="bronze" />
                        <Picker.Item label="Silver Price:30" value="silver" />
                        <Picker.Item label="Gold Price:50" value="gold" />
                        </Picker>
                      
                }
                
                </Card>
                {subscription != null ? <Card>
                <Text>you selected: {details[0]}</Text>
                <Text>you selected: {details[1]}</Text>
                <Text>you selected: {details[2]}</Text>
                </Card> : null}
                <View style={{height: 20}}></View>
                    <Button title="subscribe and pay" onPress={handleSubscription}/>
                </Card>
                : 
                <Card>
                    <Text>Car Wash Point: {userSub.carWashPoints}</Text>
                    <Text>Type: {userSub.type}</Text>
                    <Text>Valet Point: {userSub.valetPoints}</Text>
                </Card>
                    
   )
}