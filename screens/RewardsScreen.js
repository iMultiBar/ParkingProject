import React, { useState, useEffect } from "react";
import {
    Image,
    Platform,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Picker,

} from "react-native";

import { MonoText } from "../components/StyledText";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
require("firebase/firestore");
import moment from 'moment';

import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

export default function RewardsScreen() {
    const [points, setPoints] = useState(0);

    const [expiryDuration, setExpiryDuration] = useState("");
    const [type, setType] = useState("");
    const [rewards, setRewards] = useState([]);
    const [rewardStatus, setRewardStatus] = useState(false);
    const [reports, setReports] = useState([]); 
    const [carPlates, setCarPlates] = useState([]); 
    const [found, setFound] = useState(false); 

    useEffect(() => {
        checkUserReports();
    }, [points]);

    useEffect(() => {
        db.collection("rewards").onSnapshot(querySnapshot => {
            const rew = [];
            querySnapshot.forEach(doc => {
                rew.push({ id: doc.id, ...doc.data() });
            });
            setRewards([...rew]);
        });
    }, []);

    useEffect(() => {
        db.collection("reports&complaints").onSnapshot(querySnapshot => {
            const allReports = []; 
            querySnapshot.forEach(doc => {
                allReports.push({ id: doc.id, ...doc.data() }); 
            }); 
            setReports([...allReports]);
        }); 
    }, []); 

    useEffect(() => {
        db.collection("cars").onSnapshot(querySnapshot => {
            const userCarPlates = []; 
            querySnapshot.forEach(doc => {
                userCarPlates.push({ id: doc.id, ...doc.data() });
            });
            setCarPlates([...userCarPlates]); 
        }); 
    }, []); 


    useEffect(() => {
        checkForUserRewards(); 
    }, []); 

    console.disableYellowBox = true;



    const checkUserReports = async () => {
        
        for(let i = 0; i < carPlates.length; i++){
            let firstCarPlateArray = carPlates[i]; 
            for(let j = 0; j < firstCarPlateArray.length; j++){
                for(let k = 0; k < reports.length; k++){
                    if(reports[k].target === firstCarPlateArray[j]){
                        setFound(true); 
                    }

                    else{
                        setFound(false); 
                    }
                }
            }
        }

        let User = firebase.auth().currentUser.uid; 

        for(let i = 0; i < reports.length; i++){
            let firstReport = reports[i]; 
            if(firstReport.from = currentUser && firstReport.status === "unapproved"){
                setPoints(points + 1);
                await db.collection("users").doc(User).collection("userRewards").doc("reward").update({
                    reward_points: points
                }); 
            }

            else if (firstReport.from = currentUser && firstReport.status === "approved"){
                await db.collection("users").doc(User).collection("userRewards").doc("reward").update({
                    reward_points: points
                });
            }

            else {
                await db.collection("users").doc(User).collection("userRewards").doc("reward").update({
                    reward_points: points
                });
            }
        }


        // let check = await db.collection("reports&complaints").doc(firebase.auth().currentUser.uid).get()
        // let reportData = check.data();

        // if (reportData !== null) {
        //     setPoints(0);
        //     await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
        //         reward_points: points
        //     });
        // }

        // else if (reportStatus === "approved") {
        //     setPoints(0);
        //     await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
        //         reward_points: points
        //     });
        // }

        // else {
        //     setPoints(points + 1);
        //     await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
        //         reward_points: points
        //     })
        // }
    }


    const checkForUserRewards = async () => {
        let userRewardInfo = await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").get();
        let userRewardData = userRewardInfo.data();
        let userRewardPoints = userRewardData.reward_points;

        for (let i = 0; i < rewards.length; i++) {
            let rewardPoints = rewards[i].points;

            console.log("Current Reward Points ", rewardPoints);

            console.log("User Points ", userRewardPoints);
            console.log("Reward Points", rewardPoints);

            if (userRewardPoints === rewardPoints) {
                console.log("There is a reward");
                setRewardStatus(true);
                setType(rewards[i].type);
                setExpiryDuration(rewards[i].expiryDuration);
            }


            else {
                console.log("There is no reward");
                setRewardStatus(false);
                setType("");
                setExpiryDuration("");
            }
        }
    }


    return (
        <View>
            <Text style={{
                fontSize: 25, fontFamily: "serif",
                textAlign: "center", marginTop: 20
            }}>
                Welcome to your
            </Text>
            <Text style={{ fontSize: 25, textAlign: "center", marginBottom: 20 }}>
                Rewards Screen!
            </Text>

            {rewardStatus === true ?
                <Animatable.View animation="fadeInDown" direction="alternate" duration={2000}>
                    <Card
                        containerStyle={{ borderColor: "blue" }}
                        image={require('../assets/images/car_wash.png')}
                        title='CONGRATULATIONS!'
                        imageStyle={{ height: 250 }}
                    >
                        <Text style={{
                            marginBottom: 10,
                            textAlign: "center", fontSize: 18, fontWeight: "bold"
                        }}>
                            You have received a reward for a {type} service.
                                        </Text>
                        <Text style={{
                            marginBottom: 10, 
                            textAlign: "center", fontSize: 18, fontWeight: "bold"
                        }}>
                            The expiry date for this reward is {expiryDuration}.
                                        </Text>
                    </Card>
                </Animatable.View> :
                <Animatable.View animation="fadeInDown" direction="alternate" duration={2000}>
                    <Card
                        containerStyle={{ borderColor: "blue" }}
                        image={require('../assets/images/no-reward.png')}
                        title='SORRY!'
                        imageStyle={{ height: 250 }}
                    >
                        <Text style={{
                            marginBottom: 10, fontFamily: "serif",
                            textAlign: "center", fontSize: 18, fontWeight: "bold"
                        }}>
                            You haven't received any rewards from our parking app system.
                </Text>
                    </Card>
                </Animatable.View> }

        </View>
    )
}


RewardsScreen.navigationOptions = {
    header: null
};