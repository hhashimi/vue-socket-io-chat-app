import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";

import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbX83mWf1L5Rr8_1yUcjTafoVKgf4EVDU",
  authDomain: "socketio-chat-app-764ce.firebaseapp.com",
  projectId: "socketio-chat-app-764ce",
  storageBucket: "socketio-chat-app-764ce.appspot.com",
  messagingSenderId: "905348086676",
  appId: "1:905348086676:web:44c6da222c67658a9eed81",
  measurementId: "G-SYK96J8922",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore();

createApp(App).mount("#app");
