// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIG4A9IvnZAByUCF5y0_nR1w5FW8sK908",
  authDomain: "year4project-98de8.firebaseapp.com",
  projectId: "year4project-98de8",
  storageBucket: "year4project-98de8.firebasestorage.app",
  messagingSenderId: "250505024030",
  appId: "1:250505024030:web:3bfc5ad76e22a1d716940f",
  measurementId: "G-W8JMDWTVBR"
};

// initialise Firebase, Authentication and Firestore.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// export Firebase Authentication
export { auth, firestore };

