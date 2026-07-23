import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNoLuqcuUySPy7gRinN0bAAnlj0LY32YU",
  authDomain: "smasher-de6ce.firebaseapp.com",
  projectId: "smasher-de6ce",
  storageBucket: "smasher-de6ce.firebasestorage.app",
  messagingSenderId: "235890922334",
  appId: "1:235890922334:web:4dc1a8b9ff328d498ef5cf",
  measurementId: "G-HFRJDPJTPV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);