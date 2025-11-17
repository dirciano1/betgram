import { NextResponse } from "next/server";
import { adminDB, adminAuth } from "../../../lib/firebaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const uid = searchParams.get("uid");
    const role = searchParams.get("role");

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid e role são obrigatórios" },
        { status: 400 }
      );
    }

    await adminDB.collection("users").doc(uid).update({ role });

    await adminAuth.setCustomUserClaims(uid, { role });

    return NextResponse.json({
      ok: true,
      uid,
      role,
      message: `Role de ${uid} atualizada para ${role}`,
    });

  } catch (error) {
    console.error("ERRO SET ROLE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
