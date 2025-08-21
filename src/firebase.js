import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDJCt9RJmAOvNT90lN5-_zp8bxrvemYFZk",
  authDomain: "home-list-48857.firebaseapp.com",
  projectId: "home-list-48857",
  storageBucket: "home-list-48857.firebasestorage.app",
  messagingSenderId: "1064481400113",
  appId: "1:1064481400113:web:a862d69898706807793c10",
  measurementId: "G-BFV5J98SGM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
