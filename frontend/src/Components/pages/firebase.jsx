import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ FIX #15: Firebase config uses environment variables
// Create a .env file in /frontend with these VITE_ prefixed keys
// (Vite exposes only VITE_* vars to the browser — never expose secret keys)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2uKF0jWG5i8sUv6ggJVyBWVkml1qR0rQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alumini-network-6f3c7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alumini-network-6f3c7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alumini-network-6f3c7.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "145310072924",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:145310072924:web:5914e3b7ea5a3af260a699",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JLG7VKG285",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Note: getAnalytics() is removed — it throws in SSR/Node environments
// and is not needed for core functionality
