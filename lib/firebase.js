// lib/firebase.js
import { initializeApp } from "firebase/app";

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
  serverTimestamp,
  increment,
  deleteDoc,
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ================= CONFIG FIREBASE ==================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ================= FUNÇÕES DE AUTENTICAÇÃO ================
// 🔥 ATUALIZADO AQUI — AGORA SALVA O TOKEN EM COOKIE
async function loginComGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // 🔥 pega o token JWT do Firebase
  const token = await user.getIdToken();

  // 🔥 cria cookie acessível ao middleware
  document.cookie = `betgram_token=${token}; path=/; max-age=86400; SameSite=Lax`;

  return user;
}

async function sair() {
  // apaga cookie manualmente
  document.cookie = "betgram_token=; path=/; max-age=0";
  return signOut(auth);
}

// ================= EXPORTS ==================
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
  serverTimestamp,
  increment,
  onAuthStateChanged,
  loginComGoogle,
  sair,
};

