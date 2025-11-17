import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: "uid e role são obrigatórios" }, { status: 400 });
    }

    // 1️⃣ Atualiza o documento no Firestore
    await adminDB.collection("users").doc(uid).update({
      role,
    });

    // 2️⃣ Atualiza o token oficial do Firebase Auth (CUSTOM CLAIM)
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
