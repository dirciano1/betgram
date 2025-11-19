import { NextResponse } from "next/server";
import { dbServer, authServer, admin } from "../../../lib/firebaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const role = searchParams.get("role");

    if (!uid || !role) {
      return NextResponse.json(
        { error: true, message: "uid e role são obrigatórios" },
        { status: 400 }
      );
    }

    // Atualiza custom claims no Auth
    await authServer.setCustomUserClaims(uid, { role });

    // Atualiza no Firestore
    await dbServer.collection("users").doc(uid).update({
      role,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      uid,
      role,
      message: `Role de ${uid} atualizada para ${role}`,
    });
  } catch (err) {
    console.error("❌ setRole error:", err);
    return NextResponse.json({ error: true, message: err.message }, { status: 500 });
  }
}
