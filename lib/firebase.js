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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ================= LOGIN COM GOOGLE =================
async function loginComGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // 🔥 pega o token JWT do Firebase
  const token = await user.getIdToken();

  // 🔥 salva o token no cookie
  document.cookie = `betgram_token=${token}; path=/; max-age=86400; SameSite=Lax`;

  // ==============================
  // 🔥 GARANTE QUE O USER EXISTE E TEM ROLE/CRÉDITOS
  // ==============================
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // 👉 PRIMEIRO ACESSO → cria documento completo
    await setDoc(ref, {
      nome: user.displayName || "",
      email: user.email || "",
      foto: user.photoURL || "",
      creditos: 0,
      role: "user",
      criadoEm: Date.now(),
    });
  } else {
    // 👉 ACESSO NORMAL → garante role e creditos válidos
    const data = snap.data();

    await updateDoc(ref, {
      role: data.role || "user",           // se não existir → vira "user"
      creditos: data.creditos ?? 0,        // se undefined → vira 0
      nome: data.nome || user.displayName || "",
      email: data.email || user.email || "",
      foto: data.foto || user.photoURL || "",
    });
  }

  return user;
}

// ================= LOGOUT =================
async function sair() {
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
  deleteDoc,
  onAuthStateChanged,
  loginComGoogle,
  sair,
};
