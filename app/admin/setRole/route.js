import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, applicationDefault } from "firebase-admin/app";

try {
  initializeApp({
    credential: applicationDefault(),
  });
} catch (e) {
  // evitar erro "app already exists"
}

export async function POST(req) {
  try {
    const { uid, role } = await req.json();

    if (!uid || !role) {
      return NextResponse.json({ error: "uid e role são obrigatórios." }, { status: 400 });
    }

    // Define o role REAL no token do Firebase Auth
    await getAuth().setCustomUserClaims(uid, { role });

    return NextResponse.json({ ok: true, message: `Role atualizado para ${role}` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
