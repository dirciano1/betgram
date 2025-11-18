// lib/firebaseServer.js
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Evita reinicialização da app no Vercel
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const dbServer = admin.firestore();
export const authServer = admin.auth();
export { admin };
