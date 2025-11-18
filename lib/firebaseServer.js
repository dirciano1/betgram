// lib/firebaseServer.js
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

export const firebaseServer =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const dbServer = getFirestore(firebaseServer);

export { doc, updateDoc, increment };
