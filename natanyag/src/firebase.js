// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKGZLQydeP4rAVSvY-_Tu7zVjyDBZfDFQ",
  authDomain: "natanyag-f408e.firebaseapp.com",
  projectId: "natanyag-f408e",
  storageBucket: "natanyag-f408e.firebasestorage.app",
  messagingSenderId: "20149628985",
  appId: "1:20149628985:web:3ce0e1de4a2f642323dde8",
  measurementId: "G-C3VDN47JQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };