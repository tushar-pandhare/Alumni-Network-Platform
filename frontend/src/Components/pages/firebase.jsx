import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2uKF0jWG5i8sUv6ggJVyBWVkml1qR0rQ",
  authDomain: "alumini-network-6f3c7.firebaseapp.com",
  projectId: "alumini-network-6f3c7",
  storageBucket: "alumini-network-6f3c7.appspot.com",
  messagingSenderId: "145310072924",
  appId: "1:145310072924:web:5914e3b7ea5a3af260a699",
  measurementId: "G-JLG7VKG285"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
