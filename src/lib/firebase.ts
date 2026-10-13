import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBErh4kgqDsA3XjWb8_13QVAETMzMGhCJM",
  authDomain: "denge-yapi.firebaseapp.com",
  projectId: "denge-yapi",
  storageBucket: "denge-yapi.firebasestorage.app",
  messagingSenderId: "1096532118698",
  appId: "1:1096532118698:web:c892bf0b260a0623be54d3"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
