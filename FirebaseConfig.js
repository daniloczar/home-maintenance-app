import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB22zXKNhouMyXCBKcqsfAAE4b4Io5gWL4",
  authDomain: "home-maintenance-app-c16f3.firebaseapp.com",
  projectId: "home-maintenance-app-c16f3",
  storageBucket: "home-maintenance-app-c16f3.appspot.com",
  messagingSenderId: "507782255162",
  appId: "1:507782255162:web:b1a5ed45b57f0b4501db03",
  measurementId: "G-7TE79VT27B",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
