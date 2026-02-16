import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA05jM--jlHwaLyC5HRZowTujlLwnNfKNk",
  authDomain: "pocket-heist-yb-2025.firebaseapp.com",
  projectId: "pocket-heist-yb-2025",
  storageBucket: "pocket-heist-yb-2025.firebasestorage.app",
  messagingSenderId: "1050116334550",
  appId: "1:1050116334550:web:5e0587260fbaea53d23a77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
