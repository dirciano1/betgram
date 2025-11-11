import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const payload = await req.json();
    if (!payload.pix) return Response.json({ ok: false });

    for (const pix of payload.pix) {
      const txid = pix.txid;
      const snap = await db.collection("transactions").doc(txid).get();

      if (!snap.exists) continue;
      const tx = snap.data();
      if (tx.status === "paid") continue;

      const userRef = db.collection("users").doc(tx.uid);
      await db.runTransaction(async (t) => {
        const userSnap = await t.get(userRef);
        const saldo = userSnap.exists ? userSnap.data().creditos || 0 : 0;
        t.update(userRef, { creditos: saldo + tx.amount });
        t.update(db.collection("transactions").doc(txid), { status: "paid" });
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Erro webhook:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
