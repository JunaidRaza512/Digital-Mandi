// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX1NogmyuvjURNRXu0kvFy-yarPVswOMw",
  authDomain: "digital-mandi-5ee62.firebaseapp.com",
  projectId: "digital-mandi-5ee62",
  storageBucket: "digital-mandi-5ee62.appspot.com",
  messagingSenderId: "423019442363",
  appId: "1:423019442363:web:bf9422b057df9296d1399e",
  measurementId: "G-PD5WW9LJMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, app, storage };
// const analytics = getAnalytics(app);
