import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";
import moment from 'moment';
class Payments {
    pay(type, ammount, userId){
        db.collection("payments").add({
            userId: userId,
            type: type,
            date: moment().format('DD/MM/YYYY, h:mm:ss a'),
            ammount: ammount
        })
        // console.log("done")
    }
}
export default new Payments()
    