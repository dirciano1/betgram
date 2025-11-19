import { NextResponse } from "next/server";
import { admin, dbServer } from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const { uid, action, value } = await req.json();

    if (!uid || !action) {
      return NextResponse.json(
        { error: "UID e Action são obrigatórios" },
        { status: 400 }
      );
    }

    const FieldValue = admin.firestore.FieldValue; // ✅ ADICIONADO
    const ref = dbServer.collection("users").doc(uid);

    if (action === "addCredito") {
      await ref.update({
        creditos: FieldValue.increment(value), // ✅ CORRIGIDO
      });
    }

    if (action === "removerCredito") {
      await ref.update({
        creditos: FieldValue.increment(-value), // ✅ CORRIGIDO
      });
    }

    if (action === "promover") {
      await ref.update({ role: "admin" });
    }

    if (action === "rebaixar") {
      await ref.update({ role: "user" });
    }

    if (action === "excluir") {
      await ref.delete();
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("🔥 ERRO API ADMIN:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
