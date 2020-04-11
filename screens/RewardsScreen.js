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
import { user } from "firebase-functions/lib/providers/auth";


export default function RewardsScreen() {
    const [points, setPoints] = useState(0);

    const [expiryDuration, setExpiryDuration] = useState("");
    const [type, setType] = useState("");
    const [rewards, setRewards] = useState([]);
    const [rewardStatus, setRewardStatus] = useState(false);

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
        checkForUserRewards(); 
    }, []); 

    console.disableYellowBox = true;



    const checkUserReports = async () => {
        let check = await db.collection("reports&complaints").doc(firebase.auth().currentUser.uid).get()
        let reportData = check.data();
        let reportStatus = reportData.status;

        if (reportData !== null) {
            setPoints(0);
            await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
                reward_points: points
            });
        }

        else if (reportStatus === "approved") {
            setPoints(0);
            await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
                reward_points: points
            });
        }

        else {
            setPoints(points + 1);
            await db.collection("users").doc(firebase.auth().currentUser.uid).collection("userRewards").doc("reward").update({
                reward_points: points
            })
        }
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
            <Text style={{ fontSize: 25, fontFamily: "serif", textAlign: "center", marginBottom: 20 }}>
                Rewards Screen!
            </Text>

            {rewardStatus === true ?
                <View>
                    <Card
                        containerStyle={{ borderColor: "blue" }}
                        image={require('../assets/images/car_wash.png')}
                        title='CONGRATULATIONS!'
                        imageStyle={{ height: 250 }}
                    >
                        <Text style={{
                            marginBottom: 10, fontFamily: "serif",
                            textAlign: "center", fontSize: 18, fontWeight: "bold"
                        }}>
                            You have received a reward for a {type} service.
                                        </Text>
                        <Text style={{
                            marginBottom: 10, fontFamily: "serif",
                            textAlign: "center", fontSize: 18, fontWeight: "bold"
                        }}>
                            The expiry date for this reward is {expiryDuration}.
                                        </Text>
                    </Card>
                </View> :
                <View>
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
                </View> }

        </View>
    )
}


RewardsScreen.navigationOptions = {
    header: null
};