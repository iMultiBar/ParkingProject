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


export default function RewardsScreen() {
    const [points, setPoints] = useState(0); 

    useEffect(() =>{

    }, []);

    console.disableYellowBox = true;


    const handleReward = () => {

    }

    const setRewardPoints = () => {
        setPoints(points + 1); 
    }

    return (
        <View>
            <Text style={{fontSize: 25, fontFamily: "serif", 
            textAlign: "center", marginTop: 20}}>
                Welcome to your 
            </Text>
            <Text style={{fontSize: 25, fontFamily: "serif", textAlign: "center"}}>
                Rewards Screen!
            </Text>

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

            {/* <Card
                containerStyle={{borderColor: "blue"}}
                image={require('../assets/images/car_wash.png')}
                title='CONGRATULATIONS!'
                imageStyle={{height: 250}}
                >
                <Text style={{ marginBottom: 10, fontFamily: "serif", 
                textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
                    You have received a reward for a free car wash service. 
                </Text>
            </Card> */}
        </View>
    )
}


RewardsScreen.navigationOptions = {
    header: null
};