import { NextResponse } from "next/server";
import { dbAdmin, authAdmin } from "../../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid e role são obrigatórios" },
        { status: 400 }
      );
    }

    // Atualiza Firestore
    await adminDB.collection("users").doc(uid).update({
      role,
    });

    // Atualiza custom claim oficial
    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({
      ok: true,
      message: `Role de ${uid} atualizado para ${role}`,
    });
  } catch (error) {
    console.error("ERRO SET ROLE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
