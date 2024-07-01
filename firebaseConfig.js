// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB22zXKNhouMyXCBKcqsfAAE4b4Io5gWL4",
  authDomain: "home-maintenance-app-c16f3.firebaseapp.com",
  projectId: "home-maintenance-app-c16f3",
  storageBucket: "home-maintenance-app-c16f3.appspot.com",
  messagingSenderId: "507782255162",
  appId: "1:507782255162:web:b1a5ed45b57f0b4501db03",
  measurementId: "G-7TE79VT27B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);