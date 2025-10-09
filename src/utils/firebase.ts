import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6sJOd2uwWM72yrF3L-9eOeMANJXqK_Fg",
  authDomain: "education-app-manager.firebaseapp.com",
  projectId: "education-app-manager",
  storageBucket: "education-app-manager.firebasestorage.app",
  messagingSenderId: "1066913226439",
  appId: "1:1066913226439:web:5bbbb2cfface59748ba8e2",
  measurementId: "G-8BP93HCSE2",
};

// Initialize Firebase only if it hasn't been initialized yet
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully");
} else {
  app = getApps()[0];
  console.log("✅ Firebase already initialized, reusing existing instance");
}

// Initialize Firestore with explicit type
export const db: Firestore = getFirestore(app);
console.log("✅ Firestore initialized successfully");
