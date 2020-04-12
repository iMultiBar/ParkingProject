//@refresh reset
import React,{ useState, useEffect} from 'react';
import { ScrollView, StyleSheet,Text, Picker,View,TouchableOpacity } from 'react-native';
import db from '../db';

import firebase from "firebase/app";
import "firebase/auth";

import moment from "moment"

import Cleaner from "./CleanerScreen"
import Valet from "./ValetScreen"
import Carriar from "./carrierScreen"
import Reports from "./ReportScreen"
import Reward from "./RewardsScreen"
import Suggestions from "./SuggestionsScreen"
import ReactNativePickerModule from "react-native-picker-module"
//react elements:
import { Card , Icon, Divider , Button, Avatar,ButtonGroup,Input   } from 'react-native-elements';

//react animatable:
import * as Animatable from "react-native-animatable";


export default function UserScreen({ navigation }) {
    let pickerRef = null;
    const [user , setUser] = useState(false)
    const [serviceList , setServiceList] = useState([])
    const [service , setService] = useState(false)
    const [selectedService , setSelectedService] = useState(null)
    const [reservation, setReservation] = useState(false)
    const [subscription, setSubscription] = useState(false)
    const [requestList ,setRequestList] = useState(null)
    const [myCar, setMyCar] = useState([])

    useEffect(()=>{
        GetUser()
        getServices()
        getCarFromValet()
    },[])
    //...............

    useEffect(() => {
       getResList()
    },[])

    const getResList = async () => {
        console.log("god save the queen")
        let temp = []
        temp = await db.collection("reservation").doc(firebase.auth().currentUser.uid).get()
        if(temp.data()){
            setReservation(temp.data())
            // console.log("Fetching Reservation: ", temp.data())
        }

    }
    const getCarFromValet = async() =>{
        db.collection("requests").doc("valet").collection("valet").
        where("userId", "==", firebase.auth().currentUser.uid).onSnapshot(querySnapshot =>{
            let temp = []
            querySnapshot.forEach(doc =>{
                let info = doc.data()
                if(info.status === "parked"){
                    temp.push({id: doc.id, ...doc.data()})
                    // console.log("temp: ",temp)

                }
            })
            setMyCar([...temp])
        })
    }

    const getcar = () =>{
        db.collection("requests").doc("valet").collection("valet").doc(myCar[0].id).update({status: "requested"})
    }
    const EndRes = () => {
         db.collection("reservation").doc(firebase.auth().currentUser.uid).delete()
         getResList()
    }

    const GetUser = async () => {
        const User = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
        setUser(User.data())
        db.collection("users").doc(firebase.auth().currentUser.uid).collection("subscription").onSnapshot(subscription =>{
            subscription.forEach( doc=>{
                if(doc.data()){
                    setSubscription(doc.data());
                }
            })
            
        })
        
    }

    const getServices = async ()  => {
        let serv = []
        const info = await db.collection('requests').get()
        info.forEach(doc => {
            // console.log("Please",doc.id)
            serv.push(doc.id)
        })
        
        let s = serv.indexOf("valet")
        serv.splice(s,1)
        setServiceList(serv)
    }

    const ExtendRes = (res) => {
        var temp = reservation.endTime; 
        var status = moment(temp).add(5, 'hours').format('YYYY-MM-DD hh:mm:ss');
        db.collection("reservation")
        .doc(firebase.auth().currentUser.uid)
        .update({
            endTime:status
        });
        getResList()
    }
    const [buttons, setButtons ] = useState(['General']);
    const [buttonValet, setButtonValet ] = useState(['General','Valet Manager' ]);
    const [buttonCarriar, setButtonCarriar ] = useState(['General','Carriar Manager' ]);
    const [buttonCleaner, setButtonCleaner ] = useState(['General', 'Cleaner Manager' ]);
    const [AdminSection, setButtonAdmin ] = useState(['General','Admin Manager']);
    const [ AdminSectionList, setButtonAdminList ] = useState(['Reports','Cleaner', "Valet", "Carriar", "Reward", "Suggest"]);
    const [ selectedIndex, setSelectedIndex ] = useState(0)
    const [ selectedIndexA, setSelectedIndexA ] = useState(0)
  
  return (
      user ? 
        <View style={styles.container}>
            <View style={{padding:10,flexDirection:"row"}}>
                   
                <View style={{ alignSelf:"flex-start",flexDirection:"row",marginRight:"50%"}}>
                    <Avatar
                        rounded
                        source={{ uri: firebase.auth().currentUser.photoURL  }}
                        size="medium"
                    />
                    <Input value={user.displayName} disabled style={{padding:8}} />
                    <Button
                icon={
                        <Icon
                        name='settings'
                        type='AntDesign'
                        color='#517fa4'
                    />
                }
                onPress={() => navigation.navigate('Settings')}
                type="clear"
                />
                </View>


       
            </View>

            <Divider style={{ backgroundColor: 'blue', marginBottom:-6 }} />
            <ButtonGroup
                onPress={setSelectedIndex}
                selectedIndex={selectedIndex}
                buttons={
                    user.role == "carriar" ? buttonCarriar 
                :   user.role == "cleaner" ? buttonCleaner  
                :   user.role == "valet" ? buttonValet 
                :   user.role == "admin" ? AdminSection
                :   buttons
                }
                containerStyle={{marginLeft:-1,height:35,width:"100%"}}
            />
            {user.role == "admin" && selectedIndex == 1 ?
            <ButtonGroup
                onPress={setSelectedIndexA}
                selectedIndex={selectedIndexA}
                buttons={AdminSectionList }
                containerStyle={{marginLeft:-1,height:35,width:"100%",marginTop:-6}}
            />:null}

            { selectedIndex == 1 ? 
            <ScrollView >
                   { user.role == "admin" ? selectedIndexA == 0 ? 
                            <Card title="Reports">
                                <Reports />
                            </Card>
                            : selectedIndexA == 1 ? 
                            <Card title="Cleaner Manager">
                                    <Cleaner />
                                </Card>
                                
                            : selectedIndexA == 2 ? 
                            <Card title="Valet Manager">
                            <Valet />
                    </Card>
                            
                            : selectedIndexA == 3 ? 
                            <Card title="Carriar Manager">
                            <Carriar />
                    </Card>       
                            
                            : selectedIndexA == 4 ? 
                            <Card title="Reward Manager">
                            <Reward />
                    </Card>
                            : selectedIndexA == 5 ? 
                            <Card title="Suggestion Manager">
                            <Suggestions />
                    </Card>
                : null : null
            }
                            {/* // Your Carrier View Tap */}
                            { user.role == "carriar" ?
                            <Card title="Carriar Manager">
                                    <Carriar />
                            </Card>
                            :null
                            }
                            { user.role == "cleaner"?
                            <Card title="Cleaner Manager">
                                <Cleaner />
                            </Card>
                            :null
                            }
                            { user.role == "valet" ?
                            <Card title="Valet Manager">
                                    <Valet />
                            </Card>
                            : null
                            }
            </ScrollView>
            : 
            <ScrollView >
                {/* Request Service */}
                <Card title="Request Service">
                {Platform.OS === "ios"? 
                <>
                    <TouchableOpacity
                        onPress={() => {pickerRef.show()}}
                    >
                    <Text>{selectedService === null? "Select Service...": selectedService}</Text>
                    </TouchableOpacity>
                    <ReactNativePickerModule
                    pickerRef={e => (pickerRef = e)}
                    selectedValue={selectedService}
                    title={"Select Service... "}
                    items={serviceList}
                    style={{height: 50, width: "100%",}}
                    onCancel={() => {console.log("cancelled")}}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedService(itemValue)
                    } 
                    />
                </>:
                <Picker
                    selectedValue={selectedService}
                    style={{height: 50, width: "100%"}}
                    onValueChange={(itemValue, itemIndex) => setSelectedService(itemValue)}
                >
                    <Picker.Item label={"Select Service..."} value={""} />
                            {
                            serviceList ? 
                                serviceList.map( (item, index) =>
                                    <Picker.Item key={index} label={item} value={item} /> 
                                )
                            :
                            null
                            }
                    </Picker>
                        }
                            <Button title="Request Page" onPress={() => navigation.push(selectedService)} />
                            {myCar.length !== 0? <View>
                        <Text>Your car is parked at: c-2</Text>
                        <Text>At parking number: {myCar[0].parkingLocation}</Text>
                        <Button title="Request the car" onPress={() =>getcar()} />
                    </View> : null}
            
                </Card>

                {/* User Parking Reservation List Tap */}
                <Card title="Reservation">
                    <ScrollView>
                        { 
                            reservation ? 
                                <View>
                                    <Text>Parkings Information:</Text>
                                    <ScrollView>
                                    {  
                                        reservation.ParkingInfo.map((item,index) => 
                                            <View key={index}>
                                                <Card>
                                                <Text>  Car Plate: { item.carPlate}</Text>
                                                <Text>  Latitude: { item.latitude }</Text>
                                                <Text>  Longitude: { item.longitude }</Text>
                                                </Card>
                                            </View>
                                        )
                                    }
                                    </ScrollView>
                                    <Text style={{paddingTop:10}}>Start Time: {reservation.startTime}</Text>
                                    <Text> End Time: {reservation.endTime}</Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:10}}>
                                        <Button title="Extend" buttonStyle={{flex:1}} onPress={() => ExtendRes()} />
                                        <Button title="Cancel" buttonStyle={{flex:1,backgroundColor:"red"}} onPress={() => EndRes()} />
                                    </View>
                                    <Button title="View History" onPress={() => navigation.navigate('History')} />
                                 </View>
                                
                                :<>
                                    <Text style={{padding:10}}> There is No Reservation </Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                        <Button buttonStyle={{width:170}} title="Reserve" onPress={() => navigation.navigate('Map')} />
                                        <Button buttonStyle={{width:170}} title="View History" onPress={() => navigation.navigate('History')} />
                                    </View>
                                </>
                        }
                    </ScrollView>
                </Card>


                {/* // Your subscription Tap */}
                <Card title="subscription Details">
                {
                            subscription ?
                                <View>
                                   <Text>subscription Level: {subscription.type} </Text>
                                   <Text>Car wash Points: {subscription.carWashPoints} </Text>
                                   <Text>Valet Points: {subscription.valetPoints} </Text>
                                   <Button title="Subscribe" onPress={() => navigation.navigate("subscription")}/>  
                                </View>
                            :
                                <>
                                    <Text>You are not Subscriped</Text>
                                    <Button onPress={() => navigation.navigate("subscription")} title="Subscribe" />
                                </>
                        }
                </Card>
                <Card title="Rewards">
                {
                       
                                <View>
                                   <Reward />
                                </View>
                        }
                </Card>
                <Card title="Suggestions">
                {
                       
                                <View>
                                   <Suggestions />
                                </View>
                        }
                </Card>
                <Card title="Report Or Compaints">
                {
                       
                                <View>
                                   <Reports />
                                </View>
                        }
                </Card>

    
                        

            </ScrollView>
            }
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
    backgroundColor: "#fff",
    paddingBottom:1
  },
});
