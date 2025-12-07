import { db, doc, updateDoc, increment } from "@/lib/firebase";

export async function descontarCredito(uid) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    creditos: increment(-1),
  });
}
