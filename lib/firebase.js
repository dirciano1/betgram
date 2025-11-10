// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// 🔹 Inicializa Firebase apenas no cliente
let app;
if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} else {
  app = null; // evita inicialização no SSR
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const provider = app ? new GoogleAuthProvider() : null;

// ✅ Funções
async function loginComGoogle() {
  if (!auth || !provider) throw new Error("Firebase não inicializado (client)");
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

async function sair() {
  if (!auth) return;
  return signOut(auth);
}

export {
  auth,
  db,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  onAuthStateChanged,
  loginComGoogle,
  sair,
};
