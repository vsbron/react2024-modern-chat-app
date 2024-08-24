import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "react2024-modern-chat-app.firebaseapp.com",
  projectId: "react2024-modern-chat-app",
  storageBucket: "react2024-modern-chat-app.appspot.com",
  messagingSenderId: "515013875620",
  appId: "1:515013875620:web:283b866cbfc916f9e9d331",
};

const app = initializeApp(firebaseConfig);

// Exporting the firebase tools
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
