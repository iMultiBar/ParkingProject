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

import { Card } from 'react-native-elements';

export default function ReportScreen() {
    console.disableYellowBox = true;


    const handleReward = () => {

    }

    return (
        <View>
            <Card
                image={require('../assets/images/car_wash.png')}
                title='CONGRATULATIONS!'
                >
                <Text style={{ marginBottom: 10 }}>
                    You have received a reward for a free car wash service.  
                </Text>
            </Card>
        </View>
    )
}