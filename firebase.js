// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmjIYkOaxX5RFns1IbONm4bBzoG33TWLI",
  authDomain: "pantry-tracker-184e5.firebaseapp.com",
  projectId: "pantry-tracker-184e5",
  storageBucket: "pantry-tracker-184e5.appspot.com",
  messagingSenderId: "276689772146",
  appId: "1:276689772146:web:2c9f475f043ae902192ceb",
  measurementId: "G-67VYK58CWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}