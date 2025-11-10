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

// 🚀 Diagnóstico para confirmar variáveis de ambiente na Vercel
if (typeof window !== "undefined") {
  console.log("🚀 Firebase env check:", {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Detectada" : "❌ Ausente",
    domain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Detectado" : "❌ Ausente",
    project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Detectado" : "❌ Ausente",
  });
}

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
    console.log("🔥 Firebase inicializado no cliente.");
  } else {
    app = getApp();
    console.log("⚡ Firebase app reaproveitado.");
  }
} else {
  app = null; // evita inicialização no SSR
  console.log("🧱 Firebase não inicializado no servidor (SSR).");
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const provider = app ? new GoogleAuthProvider() : null;

// ✅ Funções
async function loginComGoogle() {
  if (typeof window === "undefined") {
    throw new Error("Login só pode ocorrer no cliente (browser).");
  }
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
