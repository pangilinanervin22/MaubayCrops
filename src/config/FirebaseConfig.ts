// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbY0LCHQZ3RqQUHZY7n0CyQW1XRZoelZw",
  authDomain: "agro-store-5ece6.firebaseapp.com",
  projectId: "agro-store-5ece6",
  storageBucket: "agro-store-5ece6.appspot.com",
  messagingSenderId: "1090292046761",
  appId: "1:1090292046761:web:483be5961dcf1372dc42b8",
};

// Initialize Firebase
const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseApp;
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
