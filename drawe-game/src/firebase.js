import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAMetxoL-BURaxdAGACjNiUB4egI2uGzcc",
  authDomain: "drawe-app-ff79a.firebaseapp.com",
  projectId: "drawe-app-ff79a",
  storageBucket: "drawe-app-ff79a.firebasestorage.app",
  messagingSenderId: "716553238544",
  appId: "1:716553238544:web:6ef2a08fda7c576a4b3295",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
