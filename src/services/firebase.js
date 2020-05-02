import * as firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAuJpDa2F6jUWFs7lVQBakFEcydtyddYQM",
  authDomain: "lastats.firebaseapp.com",
  databaseURL: "https://lastats.firebaseio.com",
  projectId: "lastats",
  storageBucket: "lastats.appspot.com",
  messagingSenderId: "450437294925",
  appId: "1:450437294925:web:6e94f612ab36e4f83da504"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export const getData = async () => {
  const statuses = db.collection('statuses')
  const issuers = db.collection('issuers')
  const emissions = db.collection('emissions')
  return {
    statuses,
    issuers,
    emissions,
  }
}