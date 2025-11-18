import { initializeApp, getApps } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

// ⛔ O Admin SDK não pode ser inicializado 2x
if (!getApps().length) {
  initializeApp({
    credential: undefined, 
    // Se você precisar usar uma service account, configuramos depois
  });
}

// Firestore Admin (para webhooks, rotas server-side, cronjobs)
export const dbServer = getFirestore();

// ===============================
// EXPORTA FUNÇÕES COMPATÍVEIS
// ===============================

// Ref para um documento
export const doc = (db, path, id) => db.doc(`${path}/${id}`);

// Ref para uma coleção
export const collection = (db, path) => db.collection(path);

// Buscar documento único
export const getDoc = async (ref) => ref.get();

// Buscar documentos por query
export const getDocs = async (q) => q.get();

// Criar querys
export const query = (...args) => args[0].where(...args.slice(1));
export const where = (field, op, value) => ({ field, op, value });

// Atualizar doc
export const updateDoc = async (ref, data) => ref.update(data);

// Incremento numérico
export const increment = (value) => FieldValue.increment(value);

// Timestamp para server
export const serverTimestamp = () => Timestamp.now();
