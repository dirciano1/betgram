import { db, doc, getDoc } from "@/lib/firebase";

export async function getCreditos(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;
  return snap.data().creditos ?? 0;
}
