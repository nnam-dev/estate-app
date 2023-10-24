// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "estate-app-b5e80.firebaseapp.com",
  projectId: "estate-app-b5e80",
  storageBucket: "estate-app-b5e80.appspot.com",
  messagingSenderId: "939595498185",
  appId: "1:939595498185:web:3f39d831b1963686194318"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);