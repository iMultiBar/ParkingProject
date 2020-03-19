// must use require for node
// also must do the following to fix firebase bug:
// - yarn install base-64 package to fix bug
// - modify firebase version in package.json to "7.11.0"
// - do a yarn install
// - change App.js to fix bug (see top of file)
import db from "./db"
var firebase = require("firebase/app");
require("firebase/firestore");

const db = firebase.firestore()

// simulate activity in firestore db
// change as necessary for your own db schema and needs

// delay between simulations (sec)
// - do not make too small or google will limit you
const DELAY = 10;

 // an array to be filled from db
 // - change to suit your own db schema and simulation needs
const parking = [];

const init = async () => {

    // do once only, not a listener
    const querySnapshot = await db.collection("parking").get()
    querySnapshot.forEach(doc => {
        parking.push({ id: doc.id, ...doc.data() });
    });
    console.log("done init: ", parking);

};

const simulate = async () => {

    // get necessary data from db for simulation to start
    await init()

    // simulate something (e.g. db update) every DELAY seconds
    setInterval(async () => {
        
        // select a random item
        const i = Math.floor(Math.random() * parking.length)

        // change it somehow
        // - must modify local copy of db data
        //   to avoid reloading from db
        const rnd = Math.random()
        let choice = ""

        // - use percentages to decide what to do
        // - change to suit your own needs
        if(rnd < 0.3333) {
            choice = "Free"
        } else if (rnd < .6666) {
            choice = "Taken"
        } else {
            choice = "OnHold"
        }
        parking[i].text += choice
        
        // update the db
        const { id, ...message } = parking[i]
        await db.collection("parking").doc(id).set(message);
    
        console.log('simulated with item[', i, ']: ', message.text)
    }, DELAY * 1000)

}

// start simulation
// - don't let it run all day and night or google will limit you
simulate()