import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-bff60.firebaseapp.com",
  projectId: "ai-interview-bff60",
  storageBucket: "ai-interview-bff60.firebasestorage.app",
  messagingSenderId: "975121904375",
  appId: "1:975121904375:web:5c3315e7dba0981e5b99f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth, provider }