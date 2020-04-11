import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { createStackNavigator } from 'react-navigation-stack';
import MapScreen from './MapScreen';
import ReservationScreen from './Reservation';
import { createAppContainer } from 'react-navigation';
import { SliderBox } from "react-native-image-slider-box";


import News from "./NewsScreen"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';



function HomeScreen(props) {

    const [images, setImages] = useState({
        images: [
            "https://www.cna.nl.ca/images/cna-fb-share.jpg", 
            "https://media-cdn.tripadvisor.com/media/photo-s/09/12/9b/d3/marine-atlantic-ferry.jpg",
            "https://www.cna-qatar.com/Campus%20Facilities/CNA-Q%20Entrance.jpg",
            "https://media.glassdoor.com/l/bd/98/1e/3b/cnaq-campus-view.jpg",
          ]
    })



    return (
        <View>
            <SliderBox images={images.images} 
            onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
            autoplay={true}
            circleLoop
        />
            <ScrollView>
                <News />
            </ScrollView>
            <TouchableOpacity style={{padding:5, paddingRight:20,alignSelf:"flex-end"}} onPress={() => props.navigation.push("News")}>
                <Text>Read More</Text>
            </TouchableOpacity>
        </View>

    )
}

HomeScreen.navigationOptions = {
    title: "Home",
    tabBarIcon: () => (
        <AntDesign name="home" size={30} color="blue" />
    )
    ,
    activeColor: "red",
    inactiveColor: "black",
    barStyle: { backgroundColor: "#FFF575" }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;

