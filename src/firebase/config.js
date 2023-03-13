// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXnjKhXnkVBX3pO5_D48WVvYo3OcSGWSY",
  authDomain: "etrk-aa087.firebaseapp.com",
  projectId: "etrk-aa087",
  storageBucket: "etrk-aa087.appspot.com",
  messagingSenderId: "1033340928681",
  appId: "1:1033340928681:web:cd7dc8d3a71ca6c92b9fb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})
export const db = getFirestore(app);